<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FirebaseNotification extends Model
{
    protected $fillable = [
        'title', 'title_ar', 'body', 'body_ar', 'image', 'link',
        'topic', 'target_users', 'status', 'sent_at', 'created_by',
    ];
    protected $casts = [
        'target_users' => 'array',
        'sent_at' => 'datetime',
    ];
}
