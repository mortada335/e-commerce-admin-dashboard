<?php

namespace App\Enums;

enum CouponStatus: int
{
    case EXPIRED = 2;
    case ENABLED = 1;
    case DISABLED = 0;
}
