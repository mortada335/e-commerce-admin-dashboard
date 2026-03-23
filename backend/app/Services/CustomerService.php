<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Customer::withCount('orders');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('email', 'ilike', "%$s%")
                  ->orWhereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", ["%$s%"])
                  ->orWhere('phone', 'ilike', "%$s%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        $sort = $filters['sort_by'] ?? 'created_at';
        $dir  = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sort, $dir);

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): Customer
    {
        $customer = Customer::create($data);
        ActivityLog::record('customer_created', $customer);
        return $customer;
    }

    public function update(Customer $customer, array $data): Customer
    {
        $old = $customer->toArray();
        $customer->update($data);
        ActivityLog::record('customer_updated', $customer, $old, $data);
        return $customer->fresh();
    }

    public function delete(Customer $customer): void
    {
        ActivityLog::record('customer_deleted', $customer);
        $customer->delete();
    }
}
