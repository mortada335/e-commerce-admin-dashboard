<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockAlert;
use App\Models\ActivityLog;
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
            'stock_quantity'      => 'required|integer|min:0|max:999999',
            'low_stock_threshold' => 'nullable|integer|min:0|max:999999',
        ]);

        $oldStock = $product->stock_quantity;
        $product->update($data);

        ActivityLog::record('stock_updated', $product, [
            'stock_quantity' => $oldStock,
        ], [
            'stock_quantity' => $data['stock_quantity'],
        ]);

        return response()->json([
            'id'             => $product->id,
            'stock_quantity' => $product->stock_quantity,
            'is_low_stock'   => $product->isLowStock(),
        ]);
    }

    public function stats(): JsonResponse
    {
        $total         = Product::count();
        $totalUnits    = Product::sum('stock_quantity');
        $outOfStock    = Product::where('stock_quantity', '<=', 0)->count();
        $lowStock      = Product::where('status', 'active')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count();
        $avgStock      = Product::avg('stock_quantity');
        $totalValue    = Product::selectRaw('SUM(price * stock_quantity) as value')->value('value');

        return response()->json([
            'total_products'  => $total,
            'total_units'     => (int) $totalUnits,
            'out_of_stock'    => $outOfStock,
            'low_stock'       => $lowStock,
            'avg_stock'       => round($avgStock ?? 0, 1),
            'total_value'     => round($totalValue ?? 0, 2),
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $logs = ActivityLog::where('action', 'stock_updated')
            ->with('user')
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'data' => collect($logs->items())->map(fn ($log) => [
                'id'          => $log->id,
                'product'     => $log->subject_type === 'App\\Models\\Product' ? $log->subject_id : null,
                'old_values'  => $log->old_values,
                'new_values'  => $log->new_values,
                'user'        => $log->user?->name,
                'created_at'  => $log->created_at->toISOString(),
            ]),
            'meta' => [
                'total'        => $logs->total(),
                'current_page' => $logs->currentPage(),
                'last_page'    => $logs->lastPage(),
            ],
        ]);
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $products = Product::with('category')
            ->orderBy('stock_quantity')
            ->get(['id', 'name', 'sku', 'category_id', 'stock_quantity', 'low_stock_threshold', 'status', 'price']);

        return response()->streamDownload(function () use ($products) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'SKU', 'Category', 'Stock', 'Threshold', 'Low Stock?', 'Status', 'Stock Value']);

            foreach ($products as $p) {
                fputcsv($handle, [
                    $p->id,
                    $p->name,
                    $p->sku,
                    $p->category?->name ?? '',
                    $p->stock_quantity,
                    $p->low_stock_threshold,
                    $p->isLowStock() ? 'Yes' : 'No',
                    $p->status,
                    round($p->price * $p->stock_quantity, 2),
                ]);
            }
            fclose($handle);
        }, 'inventory-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'items'                    => 'required|array|min:1|max:100',
            'items.*.product_id'       => 'required|integer|exists:products,id',
            'items.*.stock_quantity'   => 'required|integer|min:0|max:999999',
        ]);

        $updated = 0;
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $oldStock = $product->stock_quantity;
                $product->update(['stock_quantity' => $item['stock_quantity']]);
                ActivityLog::record('stock_updated', $product, [
                    'stock_quantity' => $oldStock,
                ], [
                    'stock_quantity' => $item['stock_quantity'],
                ]);
                $updated++;
            }
        }

        return response()->json([
            'message' => "{$updated} product(s) stock updated.",
            'updated' => $updated,
        ]);
    }
}
