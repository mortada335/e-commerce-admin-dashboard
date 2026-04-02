<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Product $product
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'      => 'low_stock',
            'priority'  => 'high',
            'title'     => 'Low Stock Alert',
            'message'   => "{$this->product->name} (SKU: {$this->product->sku}) has only {$this->product->stock_quantity} units left (threshold: {$this->product->low_stock_threshold}).",
            'product_id'=> $this->product->id,
            'stock_quantity'      => $this->product->stock_quantity,
            'low_stock_threshold' => $this->product->low_stock_threshold,
        ];
    }
}
