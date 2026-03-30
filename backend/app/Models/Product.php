<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name', 'slug', 'description', 'short_description',
        'price', 'discount_price', 'sku', 'stock_quantity', 'low_stock_threshold',
        'max_cart_quantity', 'status', 'is_featured', 'is_new', 'is_enabled',
        'weight', 'meta', 'notes',
        'discount_start_date', 'discount_expiry_date', 'discount_remaining_qty',
    ];

    protected $casts = [
        'price'                => 'decimal:2',
        'discount_price'       => 'decimal:2',
        'weight'               => 'decimal:2',
        'stock_quantity'       => 'integer',
        'low_stock_threshold'  => 'integer',
        'max_cart_quantity'    => 'integer',
        'is_featured'          => 'boolean',
        'is_new'               => 'boolean',
        'is_enabled'           => 'boolean',
        'meta'                 => 'array',
        'discount_start_date'  => 'datetime',
        'discount_expiry_date' => 'datetime',
        'discount_remaining_qty' => 'integer',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasMany
    {
        return $this->hasMany(ProductImage::class)->where('is_primary', true)->limit(1);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function stockAlert(): HasMany
    {
        return $this->hasMany(StockAlert::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->low_stock_threshold;
    }

    public function getEffectivePriceAttribute(): float
    {
        return $this->discount_price ?? $this->price;
    }
}
