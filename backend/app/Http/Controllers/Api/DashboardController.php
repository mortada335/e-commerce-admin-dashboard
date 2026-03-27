<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $service) {}

    public function stats(): JsonResponse
    {
        $from = request()->get('from');
        $to   = request()->get('to');
        return response()->json($this->service->getStats($from, $to));
    }

    public function salesChart(): JsonResponse
    {
        $days = min((int) request()->get('days', 30), 365);
        $from = request()->get('from');
        $to   = request()->get('to');
        return response()->json($this->service->getSalesChart(max($days, 1), $from, $to));
    }

    public function recentOrders(): JsonResponse
    {
        $limit = min((int) request()->get('limit', 10), 50);
        $orders = $this->service->getRecentOrders(max($limit, 1));
        return response()->json($orders);
    }

    public function topProducts(): JsonResponse
    {
        $limit = min((int) request()->get('limit', 5), 50);
        return response()->json($this->service->getTopProducts(max($limit, 1)));
    }
}
