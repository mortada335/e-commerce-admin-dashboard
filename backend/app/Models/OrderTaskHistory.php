<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTaskHistory extends Model
{
    protected $fillable = ['order_id', 'task_id', 'task_name', 'status', 'result'];

    protected $casts = ['result' => 'array'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
