<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductOptionValue extends Model
{
    protected $fillable = [
        'product_id', 'option_type_id', 'option_type_value_id',
        'quantity', 'subtract', 'price', 'price_prefix',
        'weight', 'weight_prefix',
    ];

    protected $casts = [
        'subtract' => 'boolean',
        'price' => 'decimal:4',
        'weight' => 'decimal:4',
    ];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function optionType(): BelongsTo { return $this->belongsTo(OptionType::class); }
    public function optionTypeValue(): BelongsTo { return $this->belongsTo(OptionTypeValue::class); }
}
