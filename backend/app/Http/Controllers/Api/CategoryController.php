<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Category::withCount('products')->with('parent');

        if ($request->search) {
            $query->where('name', 'ilike', "%{$request->search}%");
        }

        if ($request->parent_id !== null) {
            $query->where('parent_id', $request->parent_id ?: null);
        }

        $categories = $query->orderBy('sort_order')->paginate(min((int) $request->get('per_page', 50), 100));

        return $this->successResponse(
            CategoryResource::collection($categories->items()),
            $this->paginationMeta($categories)
        );
    }

    public function tree(): JsonResponse
    {
        $categories = Category::withCount('products')
            ->with(['children' => fn ($q) => $q->withCount('products')->with(['children' => fn ($q2) => $q2->withCount('products')])])
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();
        return $this->successResponse(CategoryResource::collection($categories));
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->has('description')) {
            $request->merge([
                'description' => strip_tags($request->description, '<p><br><strong><em><ul><li><ol><h1><h2><h3><h4><h5><h6><blockquote><a>'),
            ]);
        }

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $data['name'] = strip_tags($data['name']);
        $category = Category::create($data);
        return $this->successResponse(new CategoryResource($category), null, 201);
    }

    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children', 'products']);
        return $this->successResponse(new CategoryResource($category));
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        if ($request->has('description')) {
            $request->merge([
                'description' => strip_tags($request->description, '<p><br><strong><em><ul><li><ol><h1><h2><h3><h4><h5><h6><blockquote><a>'),
            ]);
        }

        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'slug'        => "nullable|string|max:255|unique:categories,slug,{$category->id}",
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);
        if (isset($data['name'])) {
            $data['name'] = strip_tags($data['name']);
        }
        $category->update($data);
        return $this->successResponse(new CategoryResource($category->fresh(['parent'])));
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return $this->errorResponse('VALIDATION_ERROR', 'Cannot delete a category that has products. Reassign or delete the products first.', null, 422);
        }

        if ($category->children()->exists()) {
            return $this->errorResponse('VALIDATION_ERROR', 'Cannot delete a category that has subcategories. Delete the subcategories first.', null, 422);
        }

        $category->delete();
        return $this->successResponse(null, null, 200, 'Category deleted.');
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $categories = Category::withCount('products')->with('parent')->orderBy('sort_order')->get();

        return response()->streamDownload(function () use ($categories) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Slug', 'Parent', 'Active', 'Products', 'Sort Order', 'Created At']);

            foreach ($categories as $c) {
                fputcsv($handle, [
                    $c->id,
                    $c->name,
                    $c->slug,
                    $c->parent?->name ?? '',
                    $c->is_active ? 'Yes' : 'No',
                    $c->products_count,
                    $c->sort_order,
                    $c->created_at->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, 'categories-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
