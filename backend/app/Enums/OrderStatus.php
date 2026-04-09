<?php

namespace App\Enums;

enum OrderStatus: int
{
    case NEW_ORDER = 1;
    case COMPLETED = 5;
    case WHATSAPP_COMPLETED = 25;
    case CANCELLED_ORDER = 7;
    case REFUNDED = 11;
    case CASHLESS_PENDING = 20;
    case CASHLESS_FAILED = 21;
}
