<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryDisable extends Model
{
    protected $fillable = [
        'reason', 'product_ids', 'category_ids',
        'disable_from', 'disable_until', 'is_cancelled', 'created_by',
    ];
    protected $casts = [
        'product_ids' => 'array',
        'category_ids' => 'array',
        'disable_from' => 'datetime',
        'disable_until' => 'datetime',
        'is_cancelled' => 'boolean',
    ];
}
