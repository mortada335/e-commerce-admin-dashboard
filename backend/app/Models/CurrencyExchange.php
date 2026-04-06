<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurrencyExchange extends Model
{
    protected $fillable = ['currency_from', 'currency_to', 'rate'];
    protected $casts = ['rate' => 'decimal:6'];
}
