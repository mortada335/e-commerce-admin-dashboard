<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'image',
        'link',
        'target',
        'is_active',
        'sort_order',
        'banner_type',
        'banner_type_id',
        'event_date',
        'event_date_end',
        'event_title',
    ];

    protected $casts = [
        'is_active'      => 'boolean',
        'sort_order'     => 'integer',
        'event_date'     => 'datetime',
        'event_date_end' => 'datetime',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'banner_product');
    }
}
