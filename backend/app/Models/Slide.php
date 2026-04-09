<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    protected $fillable = ['title', 'link', 'image', 'sort_order', 'status', 'language_id'];
}
