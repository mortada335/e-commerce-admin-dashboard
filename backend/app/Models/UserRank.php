<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRank extends Model
{
    protected $fillable = ['rank_name', 'min_points', 'max_points'];
}
