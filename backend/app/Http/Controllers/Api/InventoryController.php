<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockAlert;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    use ApiResponse;

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

        $products = $query->orderBy('stock_quantity')->paginate(min((int) $request->get('per_page', 20), 100));

        return $this->successResponse(
            $products->items(),
            $this->paginationMeta($products)
        );
    }

    public function alerts(): JsonResponse
    {
        $lowStockProducts = Product::where('status', 'active')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->with(['category'])
            ->orderBy('stock_quantity')
            ->get(['id', 'name', 'sku', 'stock_quantity', 'low_stock_threshold', 'category_id']);

        return $this->successResponse([
            'count'    => $lowStockProducts->count(),
            'products' => $lowStockProducts,
        ]);
    }

    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'stock_quantity'      => 'required|integer|min:0|max:999999',
            'low_stock_threshold' => 'nullable|integer|min:0|max:999999',
            'expected_quantity'   => 'nullable|integer|min:0',
        ]);

        $oldStock = $product->stock_quantity;

        // Optimistic locking: if expected_quantity is provided, ensure no concurrent modification
        if (isset($data['expected_quantity'])) {
            $affected = Product::where('id', $product->id)
                ->where('stock_quantity', $data['expected_quantity'])
                ->update([
                    'stock_quantity'      => $data['stock_quantity'],
                    'low_stock_threshold' => $data['low_stock_threshold'] ?? $product->low_stock_threshold,
                ]);

            if ($affected === 0) {
                return $this->errorResponse(
                    'STATE_CONFLICT',
                    'Stock was modified by another user. Please refresh and try again.',
                    ['current_quantity' => $product->fresh()->stock_quantity],
                    409
                );
            }

            $product = $product->fresh();
        } else {
            $product->update([
                'stock_quantity'      => $data['stock_quantity'],
                'low_stock_threshold' => $data['low_stock_threshold'] ?? $product->low_stock_threshold,
            ]);
        }

        ActivityLog::record('stock_updated', $product, [
            'stock_quantity' => $oldStock,
        ], [
            'stock_quantity' => $data['stock_quantity'],
        ]);

        // Dispatch low stock notification if stock dropped to/below threshold
        if ($product->isLowStock() && $oldStock > $product->low_stock_threshold) {
            $admins = \App\Models\User::role('admin')->get();
            \Illuminate\Support\Facades\Notification::send(
                $admins,
                new \App\Notifications\LowStockNotification($product)
            );
        }

        return $this->successResponse([
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

        return $this->successResponse([
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
            ->paginate(min((int) $request->get('per_page', 20), 100));

        return $this->successResponse(
            collect($logs->items())->map(fn ($log) => [
                'id'          => $log->id,
                'product'     => $log->subject_type === 'App\\Models\\Product' ? $log->subject_id : null,
                'old_values'  => $log->old_values,
                'new_values'  => $log->new_values,
                'user'        => $log->user?->name,
                'created_at'  => $log->created_at->toISOString(),
            ]),
            $this->paginationMeta($logs)
        );
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

        \Illuminate\Support\Facades\DB::transaction(function () use ($request, &$updated) {
            foreach ($request->items as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();
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
        });

        return $this->successResponse([
            'updated' => $updated,
        ], null, 200, "{$updated} product(s) stock updated.");
    }
}
