<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Order::class;
    protected ?string $resourceClass = \App\Http\Resources\OrderResource::class;
    protected array $searchFields = ['order_number', 'shipping_name', 'shipping_phone'];
    protected array $filterFields = ['status', 'payment_status', 'payment_method', 'customer_id'];
    protected array $with = ['customer', 'items', 'payment', 'statusHistory'];

    public function index(Request $request): JsonResponse
    {
        $query = Order::with($this->getWith());

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('order_number', 'like', "%{$s}%")
                ->orWhere('shipping_name', 'like', "%{$s}%")
                ->orWhere('shipping_phone', 'like', "%{$s}%"));
        }

        foreach (['status', 'payment_status', 'payment_method', 'customer_id', 'device_type'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }

        if ($request->filled('order_status_id')) {
            $query->where('status', $request->order_status_id);
        }
        if ($request->filled('date_added_after')) {
            $query->whereDate('created_at', '>=', $request->date_added_after);
        }
        if ($request->filled('date_added_before')) {
            $query->whereDate('created_at', '<=', $request->date_added_before);
        }
        if ($request->filled('total_min')) {
            $query->where('total', '>=', $request->total_min);
        }
        if ($request->filled('total_max')) {
            $query->where('total', '<=', $request->total_max);
        }
        if ($request->filled('is_gift')) {
            $query->where('is_gift', filter_var($request->is_gift, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('ordering')) {
            $ord = $request->ordering;
            $dir = str_starts_with($ord, '-') ? 'desc' : 'asc';
            $query->orderBy(ltrim($ord, '-'), $dir);
        } else {
            $query->latest();
        }

        $pageSize = min((int) $request->input('page_size', 20), 200);
        return $this->paginatedResponse($query->paginate($pageSize));
    }

    public function ordersByCity(): JsonResponse
    {
        $data = Order::selectRaw('shipping_city as city, COUNT(*) as order_count, SUM(total) as total_revenue')
            ->groupBy('shipping_city')
            ->orderByDesc('order_count')
            ->get();

        return $this->successResponse($data);
    }

    public function getOrderDetails(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|exists:orders,order_id'
        ]);

        $products = \App\Models\OrderProduct::with(['product' => function($query) {
            $query->with('description');
        }])->where('order_id', $request->input('id'))->get();

        return $this->successResponse($products);
    }
}
