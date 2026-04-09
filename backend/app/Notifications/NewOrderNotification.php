<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'         => 'new_order',
            'priority'     => 'high',
            'title'        => 'New Order Received',
            'message'      => "Order {$this->order->order_number} received from {$this->order->customer->first_name} {$this->order->customer->last_name} — Total: \${$this->order->total}",
            'order_id'     => $this->order->id,
            'order_number' => $this->order->order_number,
            'total'        => $this->order->total,
        ];
    }
}
