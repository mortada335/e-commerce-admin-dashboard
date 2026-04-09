<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    protected $fillable = [
        'title', 'title_ar', 'section_type', 'sort_order', 'status',
        'config', 'items', 'background_color', 'style',
    ];
    protected $casts = [
        'config' => 'array',
        'items' => 'array',
    ];
}
