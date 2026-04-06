<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $fillable = [
        'customer_id', 'firstname', 'lastname', 'company',
        'address_1', 'address_2', 'city', 'postcode',
        'country_id', 'zone_id', 'custom_field', 'phone',
        'address_type', 'latitude', 'longitude',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
