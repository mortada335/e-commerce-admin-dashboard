<?php

namespace App\Filament\Widgets;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $monthRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->startOfMonth())->sum('total');

        $totalOrders   = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();

        $totalCustomers = Customer::count();
        $lowStockCount  = Product::where('status', 'active')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count();

        return [
            Stat::make('Total Revenue', '$' . number_format($totalRevenue, 2))
                ->description('$' . number_format($monthRevenue, 2) . ' this month')
                ->color('success')
                ->icon('heroicon-o-currency-dollar'),

            Stat::make('Total Orders', number_format($totalOrders))
                ->description($pendingOrders . ' pending')
                ->color($pendingOrders > 0 ? 'warning' : 'success')
                ->icon('heroicon-o-shopping-cart'),

            Stat::make('Customers', number_format($totalCustomers))
                ->color('info')
                ->icon('heroicon-o-users'),

            Stat::make('Low Stock Alerts', $lowStockCount)
                ->description($lowStockCount > 0 ? 'Products need restocking' : 'All stock levels OK')
                ->color($lowStockCount > 0 ? 'danger' : 'success')
                ->icon('heroicon-o-exclamation-triangle'),
        ];
    }
}
