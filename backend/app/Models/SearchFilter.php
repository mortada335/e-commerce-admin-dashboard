<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchFilter extends Model
{
    protected $fillable = ['name', 'filter_type', 'config', 'sort_order', 'status', 'language_id'];
    protected $casts = ['config' => 'array'];
}
