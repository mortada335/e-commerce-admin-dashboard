<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private DashboardService $service) {}

    public function stats(): JsonResponse
    {
        $from = request()->get('from');
        $to   = request()->get('to');
        return $this->successResponse($this->service->getStats($from, $to));
    }

    public function salesChart(): JsonResponse
    {
        $days = min((int) request()->get('days', 30), 365);
        $from = request()->get('from');
        $to   = request()->get('to');
        return $this->successResponse($this->service->getSalesChart(max($days, 1), $from, $to));
    }

    public function recentOrders(): JsonResponse
    {
        $limit = min((int) request()->get('limit', 10), 100);
        $orders = $this->service->getRecentOrders(max($limit, 1));
        return $this->successResponse($orders);
    }

    public function topProducts(): JsonResponse
    {
        $limit = min((int) request()->get('limit', 5), 50);
        return $this->successResponse($this->service->getTopProducts(max($limit, 1)));
    }

    public function orderStatusSummary(): JsonResponse
    {
        return $this->successResponse($this->service->getOrderStatusSummary());
    }

    public function newCustomers(): JsonResponse
    {
        $days = min((int) request()->get('days', 30), 365);
        return $this->successResponse($this->service->getNewCustomers(max($days, 1)));
    }

    public function revenueByCategory(): JsonResponse
    {
        return $this->successResponse($this->service->getRevenueByCategory());
    }
}
