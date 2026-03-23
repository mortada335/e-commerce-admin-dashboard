<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Order::with(['customer', 'items', 'payment']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('order_number', 'ilike', "%{$filters['search']}%")
                  ->orWhereHas('customer', fn ($c) =>
                      $c->where('email', 'ilike', "%{$filters['search']}%")
                        ->orWhereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", ["%{$filters['search']}%"])
                  );
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortDir   = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sortField, $sortDir);

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function updateStatus(Order $order, string $status, ?string $comment = null): Order
    {
        $oldStatus = $order->status;

        DB::transaction(function () use ($order, $status, $comment, $oldStatus) {
            $order->update(['status' => $status]);

            OrderStatusHistory::create([
                'order_id'   => $order->id,
                'status'     => $status,
                'comment'    => $comment,
                'created_by' => auth()->id(),
            ]);

            ActivityLog::record('order_status_changed', $order, ['status' => $oldStatus], ['status' => $status]);
        });

        return $order->fresh(['customer', 'items', 'statusHistory', 'payment']);
    }
}
