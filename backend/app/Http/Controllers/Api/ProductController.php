<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ActivityLog;
use App\Services\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(private ProductService $service) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->service->list($request->all());
        return $this->successResponse(
            ProductResource::collection($products->items()),
            $this->paginationMeta($products)
        );
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->service->create(
            $request->except('images'),
            $request->file('images', [])
        );
        return $this->successResponse(new ProductResource($product), null, 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'images', 'variants.attributeValues.attribute']);
        return $this->successResponse(new ProductResource($product));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product = $this->service->update(
            $product,
            $request->except('images'),
            $request->file('images', [])
        );
        return $this->successResponse(new ProductResource($product));
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->service->delete($product);
        return $this->successResponse(null, null, 200, 'Product deleted.');
    }

    public function deleteImage(Product $product, int $imageId): JsonResponse
    {
        $this->service->deleteImage($product, $imageId);
        return $this->successResponse(null, null, 200, 'Image deleted.');
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate([
            'ids'   => 'required|array|min:1|max:100',
            'ids.*' => 'integer|exists:products,id',
        ]);

        $products = Product::whereIn('id', $request->ids)->get();

        foreach ($products as $product) {
            $this->service->delete($product);
        }

        return $this->successResponse(null, null, 200, count($products) . ' product(s) deleted.');
    }

    public function export(Request $request): StreamedResponse
    {
        $products = $this->service->list(array_merge($request->all(), ['per_page' => 10000]));

        return response()->streamDownload(function () use ($products) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'ID', 'Name', 'SKU', 'Category', 'Brand', 'Price', 'Discount Price',
                'Discount Start', 'Discount Expiry', 'Discount Remaining Qty',
                'Stock', 'Max Cart Qty', 'Status', 'Featured', 'New', 'Enabled',
                'Notes', 'Created At',
            ]);

            foreach ($products->items() as $product) {
                fputcsv($handle, [
                    $product->id,
                    $product->name,
                    $product->sku,
                    $product->category?->name ?? '',
                    $product->brand?->name ?? '',
                    $product->price,
                    $product->discount_price ?? '',
                    $product->discount_start_date?->toDateTimeString() ?? '',
                    $product->discount_expiry_date?->toDateTimeString() ?? '',
                    $product->discount_remaining_qty ?? '',
                    $product->stock_quantity,
                    $product->max_cart_quantity,
                    $product->status,
                    $product->is_featured ? 'Yes' : 'No',
                    $product->is_new ? 'Yes' : 'No',
                    $product->is_enabled ? 'Yes' : 'No',
                    $product->notes ?? '',
                    $product->created_at->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, 'products-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function stats(): JsonResponse
    {
        $total    = Product::count();
        $active   = Product::where('status', 'active')->count();
        $inactive = Product::where('status', 'inactive')->count();
        $draft    = Product::where('status', 'draft')->count();
        $outOfStock = Product::where('stock_quantity', '<=', 0)->count();
        $lowStock = Product::where('status', 'active')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count();
        $avgPrice = Product::avg('price');
        $featured = Product::where('is_featured', true)->count();

        return $this->successResponse([
            'total'        => $total,
            'active'       => $active,
            'inactive'     => $inactive,
            'draft'        => $draft,
            'out_of_stock' => $outOfStock,
            'low_stock'    => $lowStock,
            'featured'     => $featured,
            'avg_price'    => round($avgPrice ?? 0, 2),
        ]);
    }

    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'ids'    => 'required|array|min:1|max:100',
            'ids.*'  => 'integer|exists:products,id',
            'status' => 'required|in:active,inactive,draft',
        ]);

        $count = Product::whereIn('id', $request->ids)->update(['status' => $request->status]);

        return $this->successResponse([
            'updated' => $count,
        ], null, 200, "{$count} product(s) updated to '{$request->status}'.");
    }
}
