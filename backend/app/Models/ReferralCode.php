<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralCode extends Model
{
    protected $fillable = ['user_id', 'code', 'uses_count', 'max_uses', 'reward_amount', 'status'];
    protected $casts = ['reward_amount' => 'decimal:4'];
}
