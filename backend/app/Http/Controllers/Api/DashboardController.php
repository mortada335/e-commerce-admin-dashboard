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
        return response()->json($this->service->getStats());
    }

    public function salesChart(): JsonResponse
    {
        $days = (int) request()->get('days', 30);
        return response()->json($this->service->getSalesChart($days));
    }

    public function recentOrders(): JsonResponse
    {
        $limit = (int) request()->get('limit', 10);
        $orders = $this->service->getRecentOrders($limit);
        return response()->json($orders);
    }

    public function topProducts(): JsonResponse
    {
        $limit = (int) request()->get('limit', 5);
        return response()->json($this->service->getTopProducts($limit));
    }
}
