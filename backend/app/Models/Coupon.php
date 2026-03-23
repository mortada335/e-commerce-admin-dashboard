<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'description', 'type', 'value', 'min_order_amount',
        'max_discount_amount', 'max_uses', 'used_count', 'max_uses_per_user',
        'is_active', 'starts_at', 'expires_at',
    ];

    protected $casts = [
        'value'              => 'decimal:2',
        'min_order_amount'   => 'decimal:2',
        'max_discount_amount'=> 'decimal:2',
        'max_uses'           => 'integer',
        'used_count'         => 'integer',
        'is_active'          => 'boolean',
        'starts_at'          => 'datetime',
        'expires_at'         => 'datetime',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->starts_at && now()->lt($this->starts_at)) return false;
        if ($this->expires_at && now()->gt($this->expires_at)) return false;
        if ($this->max_uses && $this->used_count >= $this->max_uses) return false;
        return true;
    }

    public function calculateDiscount(float $subtotal): float
    {
        $discount = $this->type === 'percentage'
            ? $subtotal * ($this->value / 100)
            : $this->value;

        if ($this->max_discount_amount) {
            $discount = min($discount, $this->max_discount_amount);
        }

        return round($discount, 2);
    }
}
