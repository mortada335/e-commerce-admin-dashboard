<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
            return [
            'id' => $this->id,
            'orderId'        => $this->id,
            'orderNumber' => $this->order_number,
            'status' => $this->status,
            'paymentStatus' => $this->payment_status,
            'paymentMethod'  => $this->payment_method,
            'subtotal' => (float) $this->subtotal,
            'discountAmount' => (float) $this->discount_amount,
            'couponDiscountValue' => (float) $this->coupon_discount_value,
            'taxAmount' => (float) $this->tax_amount,
            'shippingAmount' => (float) $this->shipping_amount,
            'deliveryCosts' => (float) $this->delivery_costs,
            'total' => (float) $this->total,
            'currency' => $this->currency,
            'notes' => $this->notes,
            'trackingNumber' => $this->tracking_number,
            'deviceType' => $this->device_type,
            'isGift' => $this->is_gift,
            'giftComment' => $this->gift_comment,
            'shippedAt' => $this->shipped_at?->toISOString(),
            'deliveredAt' => $this->delivered_at?->toISOString(),
            'shipping' => [
                'name' => $this->shipping_name,
                'address' => $this->shipping_address,
                'address2' => $this->shipping_address_2,
                'city' => $this->shipping_city,
                'state' => $this->shipping_state,
                'country' => $this->shipping_country, // Fixed comma trailing error if I stopped here
                'zip' => $this->shipping_zip,
                'phone' => $this->shipping_phone,
                // Frontend aliases for shipping name parts
                'shipping_firstname' => $this->shipping_firstname,
                'shipping_lastname' => $this->shipping_lastname,
            ],
            'customer' => $this->whenLoaded('customer', fn () => $this->customer ? [
                'id' => $this->customer->id,
                'fullName' => $this->customer->full_name,
                'email' => $this->customer->email,
                'phone' => $this->customer->phone,
            ] : null),
            // Front-End aliases
            'customerName'   => $this->customer ? $this->customer->full_name : 'Guest',
            'customerNumber' => $this->customer ? $this->customer->phone : $this->shipping_phone,
            'shipmentName'   => $this->shipping_name,
            // Additional aliases for frontend
            'order_status_id' => $this->status,
            'order_status' => $this->status,
            'coupon' => $this->coupon?->code ?? null,
            'dateAdded'      => $this->created_at?->toISOString(),
            'dateModified'   => $this->updated_at?->toISOString(),
            'orderData'      => [
                'orderStatusId' => $this->status,
                'status' => $this->status,
                'preparingStartedAt' => null,
                'preparingEndedAt' => null,
                'assignees' => [],
            ],

            'items' => $this->whenLoaded('items', fn () =>
                $this->items->map(fn ($item) => [
                    'id' => $item->id,
                    'productId' => $item->product_id,
                    'productName' => $item->product_name,
                    'productSku' => $item->product_sku,
                    'productOptions' => $item->product_options,
                    'unitPrice' => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ])
            ),
            'statusHistory' => $this->whenLoaded('statusHistory', fn () =>
                $this->statusHistory->map(fn ($h) => [
                    'status' => $h->status,
                    'comment' => $h->comment,
                    'createdBy' => $h->createdBy?->name,
                    'createdAt' => $h->created_at?->toISOString(),
                ])
            ),
            'payment' => $this->whenLoaded('payment', fn () => $this->payment ? [
                'method' => $this->payment->method,
                'status' => $this->payment->status,
                'amount' => (float) $this->payment->amount,
                'transactionId' => $this->payment->transaction_id
                    ? '****' . substr($this->payment->transaction_id, -4)
                    : null,
                'paidAt' => $this->payment->paid_at?->toISOString(),
            ] : null),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
