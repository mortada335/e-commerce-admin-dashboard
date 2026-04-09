<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchTag extends Model
{
    protected $fillable = ['tag', 'sort_order', 'status', 'language_id'];
}
