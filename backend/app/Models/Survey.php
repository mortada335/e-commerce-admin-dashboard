<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['title', 'description', 'questions', 'status', 'is_active', 'start_date', 'end_date'];
    protected $casts = ['questions' => 'array', 'is_active' => 'boolean', 'start_date' => 'datetime', 'end_date' => 'datetime'];
}
