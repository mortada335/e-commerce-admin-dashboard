<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Popup extends Model
{
    protected $fillable = [
        'name', 'type', 'content', 'image', 'link', 'status',
        'sort_order', 'start_date', 'end_date', 'display_frequency', 'target_pages',
    ];
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'target_pages' => 'array',
    ];
}
