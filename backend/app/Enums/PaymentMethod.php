<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'cash';
    case PAY_TABS = 'paytabs';
    case ZAIN_CASH = 'zain_cash';
    case QI_CARD = 'qi_card';
    case SWITCH = 'switch';
}
