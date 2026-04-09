<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';
    case STARTED = 'started';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}
