<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OptionTypeDescription extends Model
{
    protected $fillable = ['option_type_id', 'language_id', 'name'];

    public function optionType(): BelongsTo
    {
        return $this->belongsTo(OptionType::class);
    }
}
