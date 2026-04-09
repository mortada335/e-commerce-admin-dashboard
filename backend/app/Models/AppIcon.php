<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppIcon extends Model
{
    protected $fillable = ['name', 'icon_url', 'link', 'sort_order', 'status'];
}
