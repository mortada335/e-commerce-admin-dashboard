<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Category::withCount('products')->with('parent');

        if ($request->search) {
            $query->where('name', 'ilike', "%{$request->search}%");
        }

        if ($request->parent_id !== null) {
            $query->where('parent_id', $request->parent_id ?: null);
        }

        $categories = $query->orderBy('sort_order')->paginate(50);

        return response()->json([
            'data' => CategoryResource::collection($categories->items()),
            'meta' => ['total' => $categories->total(), 'current_page' => $categories->currentPage()],
        ]);
    }

    public function tree(): JsonResponse
    {
        $categories = Category::with('children.children')->whereNull('parent_id')->orderBy('sort_order')->get();
        return response()->json(CategoryResource::collection($categories));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $category = Category::create($data);
        return response()->json(new CategoryResource($category), 201);
    }

    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children', 'products']);
        return response()->json(new CategoryResource($category));
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'slug'        => "nullable|string|max:255|unique:categories,slug,{$category->id}",
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);
        $category->update($data);
        return response()->json(new CategoryResource($category->fresh(['parent'])));
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}
