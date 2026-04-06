<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouponHistory extends Model
{
    protected $fillable = ['coupon_id', 'order_id', 'customer_id', 'amount'];
    protected $casts = ['amount' => 'decimal:4'];
}
