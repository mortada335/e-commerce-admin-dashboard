<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderService $service) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->service->list($request->all());
        return response()->json([
            'data' => OrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['customer', 'items', 'statusHistory.createdBy', 'payment', 'coupon']);
        return response()->json(new OrderResource($order));
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status'  => 'required|in:pending,processing,shipped,delivered,canceled,refunded',
            'comment' => 'nullable|string|max:500',
        ]);

        $order = $this->service->updateStatus($order, $request->status, $request->comment);
        return response()->json(new OrderResource($order));
    }
}
