<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\ActivityLog;
use App\Services\DashboardService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Allowed status transitions: current_status => [allowed_next_statuses]
     */
    private const STATUS_TRANSITIONS = [
        'pending'    => ['processing', 'canceled'],
        'processing' => ['shipped', 'canceled'],
        'shipped'    => ['delivered'],
        'delivered'  => ['refunded'],
        'canceled'   => [],
        'refunded'   => [],
    ];

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

        return $query->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    public function updateStatus(Order $order, string $status, ?string $comment = null): Order
    {
        $oldStatus = $order->status;

        // Guard: same status
        if ($oldStatus === $status) {
            throw ValidationException::withMessages([
                'status' => ["Order is already '{$status}'."],
            ]);
        }

        // Guard: invalid transition
        $allowed = self::STATUS_TRANSITIONS[$oldStatus] ?? [];
        if (!in_array($status, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => ["Cannot transition from '{$oldStatus}' to '{$status}'. Allowed: " . (implode(', ', $allowed) ?: 'none') . "."],
            ]);
        }

        DB::transaction(function () use ($order, $status, $comment, $oldStatus) {
            $updateData = ['status' => $status];

            // Auto-set timestamps on relevant transitions
            if ($status === 'shipped' && !$order->shipped_at) {
                $updateData['shipped_at'] = now();
            }
            if ($status === 'delivered' && !$order->delivered_at) {
                $updateData['delivered_at'] = now();
            }

            $order->update($updateData);

            OrderStatusHistory::create([
                'order_id'   => $order->id,
                'status'     => $status,
                'comment'    => $comment,
                'created_by' => auth()->id(),
            ]);

            ActivityLog::record('order_status_changed', $order, ['status' => $oldStatus], ['status' => $status]);
        });

        // Invalidate dashboard cache after order status change
        DashboardService::invalidateCache();

        return $order->fresh(['customer', 'items', 'statusHistory', 'payment']);
    }

    /**
     * Validate a status transition without applying it (used by bulk operations).
     */
    public function canTransition(Order $order, string $newStatus): bool
    {
        $allowed = self::STATUS_TRANSITIONS[$order->status] ?? [];
        return in_array($newStatus, $allowed, true);
    }
}
