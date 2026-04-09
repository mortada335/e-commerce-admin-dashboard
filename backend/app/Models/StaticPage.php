<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaticPage extends Model
{
    protected $fillable = [
        'title', 'slug', 'content', 'language_id', 'sort_order',
        'status', 'meta_title', 'meta_description',
    ];
}
