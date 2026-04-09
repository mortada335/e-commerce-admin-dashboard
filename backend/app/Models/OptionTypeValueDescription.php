<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OptionTypeValueDescription extends Model
{
    protected $fillable = ['option_type_value_id', 'language_id', 'name'];

    public function optionTypeValue(): BelongsTo
    {
        return $this->belongsTo(OptionTypeValue::class);
    }
}
