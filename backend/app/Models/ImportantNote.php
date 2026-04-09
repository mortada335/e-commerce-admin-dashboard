<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportantNote extends Model
{
    protected $fillable = ['title', 'description', 'status', 'created_by', 'start_date', 'end_date'];
    protected $casts = ['start_date' => 'datetime', 'end_date' => 'datetime'];
}
