<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number', 'customer_id', 'coupon_id', 'status', 'payment_status',
        'payment_method', 'subtotal', 'discount_amount', 'coupon_discount_value',
        'tax_amount', 'shipping_amount', 'delivery_costs', 'total', 'currency',
        'notes', 'shipping_name', 'shipping_address', 'shipping_address_2',
        'shipping_city', 'shipping_state', 'shipping_country', 'shipping_zip', 'shipping_phone',
        'shipped_at', 'delivered_at', 'tracking_number',
        'device_type', 'is_gift', 'gift_comment',
    ];

    protected $casts = [
        'subtotal'              => 'decimal:2',
        'discount_amount'       => 'decimal:2',
        'coupon_discount_value' => 'decimal:2',
        'tax_amount'            => 'decimal:2',
        'shipping_amount'       => 'decimal:2',
        'delivery_costs'        => 'decimal:4',
        'total'                 => 'decimal:2',
        'shipped_at'            => 'datetime',
        'delivered_at'          => 'datetime',
        'is_gift'               => 'boolean',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class)->latest();
    }
}
