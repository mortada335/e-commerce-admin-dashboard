<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(private CustomerService $service) {}

    public function index(Request $request): JsonResponse
    {
        $customers = $this->service->list($request->all());
        return response()->json([
            'data' => CustomerResource::collection($customers->items()),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page'    => $customers->lastPage(),
                'per_page'     => $customers->perPage(),
                'total'        => $customers->total(),
            ],
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = $this->service->create($request->validated());
        return response()->json(new CustomerResource($customer), 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        $customer->load('orders');
        $data = (new CustomerResource($customer))->toArray(request());

        // Enrich with computed stats
        $data['last_order_date'] = $customer->orders->max('created_at')?->toISOString();
        $data['avg_order_value'] = $customer->orders->count() > 0
            ? round($customer->orders->avg('total'), 2)
            : 0;
        $data['orders_count'] = $customer->orders->count();
        $data['total_spent'] = round($customer->orders->sum('total'), 2);

        return response()->json($data);
    }

    public function update(StoreCustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer = $this->service->update($customer, $request->validated());
        return response()->json(new CustomerResource($customer));
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $this->service->delete($customer);
        return response()->json(['message' => 'Customer deleted.']);
    }

    public function orders(Customer $customer): JsonResponse
    {
        $orders = $customer->orders()->with(['items', 'payment'])->latest()->paginate(15);
        return response()->json([
            'data' => OrderResource::collection($orders->items()),
            'meta' => ['current_page' => $orders->currentPage(), 'last_page' => $orders->lastPage(), 'total' => $orders->total()],
        ]);
    }

    public function stats(): JsonResponse
    {
        $total     = Customer::count();
        $active    = Customer::where('is_active', true)->count();
        $inactive  = Customer::where('is_active', false)->count();
        $thisMonth = Customer::where('created_at', '>=', now()->startOfMonth())->count();

        $topSpender = Customer::withSum('orders', 'total')
            ->orderByDesc('orders_sum_total')
            ->first();

        $avgOrders = Customer::withCount('orders')->get()->avg('orders_count');

        return response()->json([
            'total'            => $total,
            'active'           => $active,
            'inactive'         => $inactive,
            'new_this_month'   => $thisMonth,
            'avg_orders'       => round($avgOrders ?? 0, 1),
            'top_spender'      => $topSpender ? [
                'id'         => $topSpender->id,
                'full_name'  => $topSpender->full_name,
                'total_spent'=> round($topSpender->orders_sum_total ?? 0, 2),
            ] : null,
        ]);
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $customers = Customer::withCount('orders')
            ->withSum('orders', 'total')
            ->orderByDesc('created_at')
            ->get();

        return response()->streamDownload(function () use ($customers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Active', 'Orders', 'Total Spent', 'Joined']);

            foreach ($customers as $c) {
                fputcsv($handle, [
                    $c->id,
                    $c->full_name,
                    $c->email,
                    $c->phone ?? '',
                    $c->is_active ? 'Yes' : 'No',
                    $c->orders_count,
                    round($c->orders_sum_total ?? 0, 2),
                    $c->created_at->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, 'customers-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
