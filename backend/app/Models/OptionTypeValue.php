<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OptionTypeValue extends Model
{
    protected $fillable = ['option_type_id', 'image', 'sort_order'];

    public function optionType(): BelongsTo
    {
        return $this->belongsTo(OptionType::class);
    }

    public function descriptions(): HasMany
    {
        return $this->hasMany(OptionTypeValueDescription::class);
    }
}
