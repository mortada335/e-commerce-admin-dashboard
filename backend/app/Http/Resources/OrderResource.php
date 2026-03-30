<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'             => $this->id,
            'order_number'   => $this->order_number,
            'status'                => $this->status,
            'payment_status'        => $this->payment_status,
            'payment_method'        => $this->payment_method,
            'subtotal'              => (float) $this->subtotal,
            'discount_amount'       => (float) $this->discount_amount,
            'coupon_discount_value' => (float) $this->coupon_discount_value,
            'tax_amount'            => (float) $this->tax_amount,
            'shipping_amount'       => (float) $this->shipping_amount,
            'delivery_costs'        => (float) $this->delivery_costs,
            'total'                 => (float) $this->total,
            'currency'              => $this->currency,
            'notes'                 => $this->notes,
            'tracking_number'       => $this->tracking_number,
            'device_type'           => $this->device_type,
            'is_gift'               => $this->is_gift,
            'gift_comment'          => $this->gift_comment,
            'shipped_at'            => $this->shipped_at?->toISOString(),
            'delivered_at'          => $this->delivered_at?->toISOString(),
            'shipping' => [
                'name'      => $this->shipping_name,
                'address'   => $this->shipping_address,
                'address_2' => $this->shipping_address_2,
                'city'      => $this->shipping_city,
                'state'     => $this->shipping_state,
                'country'   => $this->shipping_country,
                'zip'       => $this->shipping_zip,
                'phone'     => $this->shipping_phone,
            ],
            'customer' => $this->whenLoaded('customer', fn () => $this->customer ? [
                'id'         => $this->customer->id,
                'full_name'  => $this->customer->full_name,
                'email'      => $this->customer->email,
                'phone'      => $this->customer->phone,
            ] : null),
            'items' => $this->whenLoaded('items', fn () =>
                $this->items->map(fn ($item) => [
                    'id'              => $item->id,
                    'product_id'      => $item->product_id,
                    'product_name'    => $item->product_name,
                    'product_sku'     => $item->product_sku,
                    'product_options' => $item->product_options,
                    'unit_price'      => (float) $item->unit_price,
                    'quantity'        => $item->quantity,
                    'subtotal'        => (float) $item->subtotal,
                ])
            ),
            'status_history' => $this->whenLoaded('statusHistory', fn () =>
                $this->statusHistory->map(fn ($h) => [
                    'status'     => $h->status,
                    'comment'    => $h->comment,
                    'created_by' => $h->createdBy?->name,
                    'created_at' => $h->created_at?->toISOString(),
                ])
            ),
            'payment' => $this->whenLoaded('payment', fn () => $this->payment ? [
                'method'         => $this->payment->method,
                'status'         => $this->payment->status,
                'amount'         => (float) $this->payment->amount,
                'transaction_id' => $this->payment->transaction_id,
                'paid_at'        => $this->payment->paid_at?->toISOString(),
            ] : null),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
