<?php

namespace App\Enums;

enum ActionType: string
{
    case NO_ACTION_NEXT_QUESTION = 'none';
    case OPEN_USER_ORDERS_LIST = 'open_orders';
    case OPEN_USER_CART = 'open_cart';
    case OPEN_USER_PROFILE = 'open_profile';
}
