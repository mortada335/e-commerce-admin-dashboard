<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'images'])
            ->select(['id', 'name', 'sku', 'stock_quantity', 'low_stock_threshold', 'status', 'category_id']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('sku', 'ilike', "%{$request->search}%");
            });
        }

        $products = $query->orderBy('stock_quantity')->paginate(20);

        return response()->json([
            'data' => $products->items(),
            'meta' => ['total' => $products->total(), 'current_page' => $products->currentPage()],
        ]);
    }

    public function alerts(): JsonResponse
    {
        $lowStockProducts = Product::where('status', 'active')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->with(['category'])
            ->orderBy('stock_quantity')
            ->get(['id', 'name', 'sku', 'stock_quantity', 'low_stock_threshold', 'category_id']);

        return response()->json([
            'count'    => $lowStockProducts->count(),
            'products' => $lowStockProducts,
        ]);
    }

    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'stock_quantity'      => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);
        $product->update($data);
        return response()->json([
            'id'             => $product->id,
            'stock_quantity' => $product->stock_quantity,
            'is_low_stock'   => $product->isLowStock(),
        ]);
    }
}
