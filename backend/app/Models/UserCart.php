<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCart extends Model
{
    protected $fillable = ['customer_id', 'product_id', 'quantity', 'options'];
    protected $casts = ['options' => 'array'];
}
