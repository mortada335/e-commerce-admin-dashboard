<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardService
{
    public function getStats(?string $from = null, ?string $to = null): array
    {
        $now = Carbon::now();

        // If custom date range provided, compute stats for that range
        if ($from && $to) {
            $start = Carbon::parse($from)->startOfDay();
            $end   = Carbon::parse($to)->endOfDay();
            $rangeLength = $start->diffInDays($end);

            // Previous period for comparison
            $prevStart = $start->copy()->subDays($rangeLength + 1);
            $prevEnd   = $start->copy()->subDay()->endOfDay();

            $rangeRevenue = Order::where('payment_status', 'paid')
                ->whereBetween('created_at', [$start, $end])->sum('total');
            $prevRevenue = Order::where('payment_status', 'paid')
                ->whereBetween('created_at', [$prevStart, $prevEnd])->sum('total');

            $rangeOrders = Order::whereBetween('created_at', [$start, $end])->count();
            $pendingOrders = Order::where('status', 'pending')
                ->whereBetween('created_at', [$start, $end])->count();

            $rangeCustomers = Customer::whereBetween('created_at', [$start, $end])->count();

            $lowStockProducts = Product::where('status', 'active')
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count();

            return [
                'revenue' => [
                    'total'       => round($rangeRevenue, 2),
                    'this_month'  => round($rangeRevenue, 2),
                    'last_month'  => round($prevRevenue, 2),
                    'growth'      => $prevRevenue > 0
                        ? round((($rangeRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
                        : 0,
                ],
                'orders' => [
                    'total'      => $rangeOrders,
                    'this_month' => $rangeOrders,
                    'pending'    => $pendingOrders,
                ],
                'customers' => [
                    'total'      => $rangeCustomers,
                    'this_month' => $rangeCustomers,
                ],
                'inventory' => [
                    'low_stock_count' => $lowStockProducts,
                ],
            ];
        }

        // Default: current month stats
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

    public function getSalesChart(int $days = 30, ?string $from = null, ?string $to = null): array
    {
        $query = Order::where('payment_status', 'paid');

        if ($from && $to) {
            $query->whereBetween('created_at', [
                Carbon::parse($from)->startOfDay(),
                Carbon::parse($to)->endOfDay(),
            ]);
        } else {
            $query->where('created_at', '>=', now()->subDays($days));
        }

        $data = $query
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

    public function getOrderStatusSummary(): array
    {
        $statuses = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $paymentStatuses = Order::selectRaw('payment_status, COUNT(*) as count')
            ->groupBy('payment_status')
            ->pluck('count', 'payment_status')
            ->toArray();

        return [
            'by_status'         => $statuses,
            'by_payment_status' => $paymentStatuses,
            'total'             => array_sum($statuses),
        ];
    }

    public function getNewCustomers(int $days = 30): array
    {
        $data = Customer::where('created_at', '>=', now()->subDays($days))
            ->selectRaw("DATE(created_at) as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'total_new' => $data->sum('count'),
            'daily'     => $data->map(fn ($row) => [
                'date'  => $row->date,
                'count' => $row->count,
            ])->values()->toArray(),
        ];
    }

    public function getRevenueByCategory(): array
    {
        $data = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->selectRaw('categories.id, categories.name, SUM(order_items.subtotal) as revenue, COUNT(DISTINCT orders.id) as orders_count')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->get();

        return $data->map(fn ($row) => [
            'category_id'  => $row->id,
            'category_name'=> $row->name,
            'revenue'      => round($row->revenue, 2),
            'orders_count' => $row->orders_count,
        ])->values()->toArray();
    }
}
