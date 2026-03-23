<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardService
{
    public function getStats(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $lastMonth = $now->copy()->subMonth()->startOfMonth();
        $endLastMonth = $now->copy()->subMonth()->endOfMonth();

        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $monthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfMonth, $now])->sum('total');
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $endLastMonth])->sum('total');

        $totalOrders = Order::count();
        $monthOrders = Order::whereBetween('created_at', [$startOfMonth, $now])->count();
        $pendingOrders = Order::where('status', 'pending')->count();

        $totalCustomers = Customer::count();
        $monthCustomers = Customer::whereBetween('created_at', [$startOfMonth, $now])->count();

        $lowStockProducts = Product::where('status', 'active')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count();

        return [
            'revenue' => [
                'total'       => round($totalRevenue, 2),
                'this_month'  => round($monthRevenue, 2),
                'last_month'  => round($lastMonthRevenue, 2),
                'growth'      => $lastMonthRevenue > 0
                    ? round((($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
                    : 0,
            ],
            'orders' => [
                'total'    => $totalOrders,
                'this_month' => $monthOrders,
                'pending'  => $pendingOrders,
            ],
            'customers' => [
                'total'      => $totalCustomers,
                'this_month' => $monthCustomers,
            ],
            'inventory' => [
                'low_stock_count' => $lowStockProducts,
            ],
        ];
    }

    public function getSalesChart(int $days = 30): array
    {
        $data = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays($days))
            ->selectRaw("DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $data->map(fn ($row) => [
            'date'    => $row->date,
            'revenue' => round($row->revenue, 2),
            'orders'  => $row->orders,
        ])->values()->toArray();
    }

    public function getRecentOrders(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return Order::with(['customer', 'items'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getTopProducts(int $limit = 5): \Illuminate\Support\Collection
    {
        return DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->selectRaw('products.id, products.name, products.sku, SUM(order_items.quantity) as total_sold, SUM(order_items.subtotal) as total_revenue')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();
    }
}
