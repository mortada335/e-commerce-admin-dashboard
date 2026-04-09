<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerMembership extends Model
{
    protected $fillable = [
        'customer_id', 'membership_type', 'points', 'total_spent',
        'total_orders', 'status', 'member_since', 'expires_at', 'benefits',
    ];
    protected $casts = [
        'total_spent' => 'decimal:4',
        'member_since' => 'datetime',
        'expires_at' => 'datetime',
        'benefits' => 'array',
    ];
}
