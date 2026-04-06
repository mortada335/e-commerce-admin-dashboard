<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryCost extends Model
{
    protected $fillable = ['city', 'zone', 'cost', 'free_delivery_threshold', 'estimated_days', 'status'];
    protected $casts = [
        'cost' => 'decimal:4',
        'free_delivery_threshold' => 'decimal:4',
    ];
}
