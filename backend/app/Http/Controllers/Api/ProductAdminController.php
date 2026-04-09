<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Product::class;
    protected ?string $resourceClass = \App\Http\Resources\ProductResource::class;
    protected array $searchFields = ['name', 'sku', 'description'];
    protected array $filterFields = [
        'category_id', 'brand_id', 'status', 'is_featured', 'is_new', 'is_enabled',
    ];
    protected array $with = ['category', 'brand', 'images', 'variants'];

    public function index(Request $request): JsonResponse
    {
        $query = Product::with($this->getWith());

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('sku', 'like', "%{$s}%")
                ->orWhere('description', 'like', "%{$s}%"));
        }

        // Swagger-specific filters
        foreach (['category_id', 'brand_id', 'status'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        // manufacturer_id maps to brand_id
        if ($request->filled('manufacturer_id')) {
            $query->where('brand_id', $request->input('manufacturer_id'));
        }
        if ($request->filled('enabled')) {
            $query->where('is_enabled', filter_var($request->enabled, FILTER_VALIDATE_BOOLEAN));
        }
        if ($request->filled('new_product')) {
            $query->where('is_new', filter_var($request->new_product, FILTER_VALIDATE_BOOLEAN));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('date_added_after')) {
            $query->whereDate('created_at', '>=', $request->date_added_after);
        }
        if ($request->filled('date_added_before')) {
            $query->whereDate('created_at', '<=', $request->date_added_before);
        }

        // Ordering
        if ($request->filled('ordering')) {
            $ord = $request->ordering;
            $dir = str_starts_with($ord, '-') ? 'desc' : 'asc';
            $query->orderBy(ltrim($ord, '-'), $dir);
        } else {
            $query->latest();
        }

        $pageSize = min((int) $request->input('page_size', 20), 200);
        $data = $query->paginate($pageSize);

        return $this->paginatedResponse($data);
    }

    public function bulkAddCategories(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.category_ids' => 'required|array',
        ]);

        $updated = 0;
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product && !empty($item['category_ids'])) {
                $product->update(['category_id' => $item['category_ids'][0]]);
                $updated++;
            }
        }

        return $this->successResponse(['updated' => $updated]);
    }

    public function bulkPriceUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $updated = 0;
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $product->update(['price' => $item['price']]);
                $updated++;
            }
        }

        return $this->successResponse(['updated' => $updated]);
    }

    public function bulkStatusUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:products,id',
            'status' => 'required',
        ]);

        $count = Product::whereIn('id', $request->ids)->update(['status' => $request->status]);

        return $this->successResponse(['updated' => $count]);
    }

    public function searchHtml(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%"));
        }

        return $this->successResponse($query->select('id', 'name', 'sku', 'price')->limit(20)->get());
    }

    public function searchHtmlDetail($id): JsonResponse
    {
        return $this->successResponse(Product::findOrFail($id));
    }
}
