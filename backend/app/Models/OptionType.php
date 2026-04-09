<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OptionType extends Model
{
    protected $fillable = ['type', 'sort_order'];

    public function descriptions(): HasMany
    {
        return $this->hasMany(OptionTypeDescription::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(OptionTypeValue::class);
    }
}
