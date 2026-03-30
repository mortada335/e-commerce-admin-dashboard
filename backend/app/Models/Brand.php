<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'logo',
        'is_active',
        'sort_order',
        'noindex',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
        'noindex'    => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
