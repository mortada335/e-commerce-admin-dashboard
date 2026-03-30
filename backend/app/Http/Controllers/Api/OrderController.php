<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'ids'    => 'required|array|min:1|max:100',
            'ids.*'  => 'integer|exists:orders,id',
            'status' => 'required|in:pending,processing,shipped,delivered,canceled,refunded',
        ]);

        $orders = Order::whereIn('id', $request->ids)->get();
        $updated = 0;
        $skipped = [];

        foreach ($orders as $order) {
            if ($this->service->canTransition($order, $request->status)) {
                $this->service->updateStatus($order, $request->status);
                $updated++;
            } else {
                $skipped[] = [
                    'id'            => $order->id,
                    'order_number'  => $order->order_number,
                    'current_status'=> $order->status,
                    'reason'        => "Cannot transition from '{$order->status}' to '{$request->status}'.",
                ];
            }
        }

        return response()->json([
            'message' => "{$updated} order(s) updated.",
            'skipped' => $skipped,
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $orders = $this->service->list(array_merge($request->all(), ['per_page' => 10000]));

        return response()->streamDownload(function () use ($orders) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'Order #', 'Customer', 'Status', 'Payment Status', 'Payment Method',
                'Subtotal', 'Discount', 'Coupon Discount', 'Tax', 'Shipping',
                'Delivery Costs', 'Total', 'Device Type', 'Is Gift', 'Tracking #', 'Created At',
            ]);

            foreach ($orders->items() as $order) {
                fputcsv($handle, [
                    $order->order_number,
                    $order->customer?->full_name ?? 'Guest',
                    $order->status,
                    $order->payment_status,
                    $order->payment_method ?? '',
                    $order->subtotal,
                    $order->discount_amount,
                    $order->coupon_discount_value,
                    $order->tax_amount,
                    $order->shipping_amount,
                    $order->delivery_costs,
                    $order->total,
                    $order->device_type ?? '',
                    $order->is_gift ? 'Yes' : 'No',
                    $order->tracking_number ?? '',
                    $order->created_at->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, 'orders-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function stats(): JsonResponse
    {
        $total = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $avgOrderValue = Order::where('payment_status', 'paid')->avg('total');

        $byPaymentMethod = Order::whereNotNull('payment_method')
            ->selectRaw('payment_method, COUNT(*) as count')
            ->groupBy('payment_method')
            ->pluck('count', 'payment_method');

        $byDeviceType = Order::whereNotNull('device_type')
            ->where('device_type', '!=', '')
            ->selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->pluck('count', 'device_type');

        $giftOrders = Order::where('is_gift', true)->count();

        return response()->json([
            'total'             => $total,
            'total_revenue'     => round($totalRevenue, 2),
            'avg_order_value'   => round($avgOrderValue ?? 0, 2),
            'gift_orders'       => $giftOrders,
            'by_payment_method' => $byPaymentMethod,
            'by_device_type'    => $byDeviceType,
        ]);
    }
}
