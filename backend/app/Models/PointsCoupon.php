<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointsCoupon extends Model
{
    protected $fillable = [
        'name', 'code', 'points_required', 'discount', 'type',
        'uses_total', 'uses_customer', 'status', 'date_start', 'date_end',
    ];
    protected $casts = [
        'discount' => 'decimal:4',
        'date_start' => 'datetime',
        'date_end' => 'datetime',
    ];
}
