<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchDiscover extends Model
{
    protected $fillable = ['keyword', 'image', 'link', 'sort_order', 'status', 'language_id'];
}
