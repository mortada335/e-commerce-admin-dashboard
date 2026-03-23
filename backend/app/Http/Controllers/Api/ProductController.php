<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
