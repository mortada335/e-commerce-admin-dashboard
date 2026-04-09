<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscountOperationController extends Controller
{
    use ApiResponse;

    public function applyRandomDiscount(Request $request): JsonResponse
    {
        $request->validate([
            'category_id' => 'nullable|integer',
            'brand_id'    => 'nullable|integer',
            'min_discount' => 'required|numeric|min:0',
            'max_discount' => 'required|numeric|min:0',
        ]);

        $query = Product::where('is_enabled', true);
        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('brand_id')) $query->where('brand_id', $request->brand_id);

        $products = $query->get();
        $updated = 0;

        foreach ($products as $product) {
            $discount = rand((int)($request->min_discount * 100), (int)($request->max_discount * 100)) / 100;
            $discountedPrice = $product->price * (1 - $discount / 100);
            $product->update(['discount_price' => round($discountedPrice, 2)]);
            $updated++;
        }

        return $this->successResponse(['updated' => $updated]);
    }

    public function assignBrandProducts(Request $request): JsonResponse
    {
        $request->validate([
            'brand_id'    => 'required|integer',
            'product_ids' => 'required|array',
        ]);

        $count = Product::whereIn('id', $request->product_ids)
            ->update(['brand_id' => $request->brand_id]);

        return $this->successResponse(['updated' => $count]);
    }
}
