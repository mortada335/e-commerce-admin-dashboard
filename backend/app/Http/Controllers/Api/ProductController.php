<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ActivityLog;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->service->list($request->all());
        return response()->json([
            'data'  => ProductResource::collection($products->items()),
            'meta'  => [
                'current_page'  => $products->currentPage(),
                'last_page'     => $products->lastPage(),
                'per_page'      => $products->perPage(),
                'total'         => $products->total(),
            ],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->service->create(
            $request->except('images'),
            $request->file('images', [])
        );
        return response()->json(new ProductResource($product), 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'images', 'variants.attributeValues.attribute']);
        return response()->json(new ProductResource($product));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product = $this->service->update(
            $product,
            $request->except('images'),
            $request->file('images', [])
        );
        return response()->json(new ProductResource($product));
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->service->delete($product);
        return response()->json(['message' => 'Product deleted.']);
    }

    public function deleteImage(Product $product, int $imageId): JsonResponse
    {
        $this->service->deleteImage($product, $imageId);
        return response()->json(['message' => 'Image deleted.']);
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

        return response()->json([
            'message' => count($products) . ' product(s) deleted.',
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $products = $this->service->list(array_merge($request->all(), ['per_page' => 10000]));

        return response()->streamDownload(function () use ($products) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'SKU', 'Category', 'Price', 'Discount Price', 'Stock', 'Status', 'Featured', 'Created At']);

            foreach ($products->items() as $product) {
                fputcsv($handle, [
                    $product->id,
                    $product->name,
                    $product->sku,
                    $product->category?->name ?? '',
                    $product->price,
                    $product->discount_price ?? '',
                    $product->stock_quantity,
                    $product->status,
                    $product->is_featured ? 'Yes' : 'No',
                    $product->created_at->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, 'products-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
