<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPointsHistory extends Model
{
    protected $fillable = ['order_id', 'customer_id', 'points', 'description'];
}
