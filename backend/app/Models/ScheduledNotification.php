<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledNotification extends Model
{
    protected $fillable = [
        'title', 'title_ar', 'body', 'body_ar', 'image', 'link',
        'scheduled_at', 'is_approved', 'approved_by', 'status',
        'target', 'created_by',
    ];
    protected $casts = [
        'scheduled_at' => 'datetime',
        'is_approved' => 'boolean',
        'target' => 'array',
    ];
}
