<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSearch extends Model
{
    protected $fillable = ['user_id', 'search_param', 'last_searched'];
    protected $casts = ['last_searched' => 'datetime'];
}
