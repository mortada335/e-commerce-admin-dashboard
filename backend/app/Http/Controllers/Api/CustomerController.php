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
        return response()->json(new CustomerResource($customer));
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
}
