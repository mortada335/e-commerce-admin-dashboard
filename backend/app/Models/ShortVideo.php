<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShortVideo extends Model
{
    protected $fillable = ['title', 'video_url', 'thumbnail', 'product_id', 'sort_order', 'status'];
}
