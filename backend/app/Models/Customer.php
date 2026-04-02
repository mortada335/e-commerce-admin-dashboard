<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'avatar', 'date_of_birth',
        'gender', 'is_active', 'email_verified_at',
        'address_line1', 'address_line2', 'city', 'state', 'country', 'zip',
    ];

    protected $casts = [
        'is_active'         => 'boolean',
        'email_verified_at' => 'datetime',
        'date_of_birth'     => 'date',
        'address_line1'     => 'encrypted',
        'address_line2'     => 'encrypted',
        'city'              => 'encrypted',
        'state'             => 'encrypted',
        'country'           => 'encrypted',
        'zip'               => 'encrypted',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getTotalSpentAttribute(): float
    {
        return $this->orders()->where('payment_status', 'paid')->sum('total');
    }
}
