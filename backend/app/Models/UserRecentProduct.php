<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRecentProduct extends Model
{
    protected $fillable = ['user_id', 'product_id', 'viewed_at'];
    protected $casts = ['viewed_at' => 'datetime'];
}
