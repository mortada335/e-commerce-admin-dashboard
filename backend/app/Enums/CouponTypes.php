<?php

namespace App\Enums;

enum CouponTypes: string
{
    case FREE_DELIVERY = 'D';
    case FREE_DELIVERY_FIRST_ORDER = 'Z';
    case PERCENTAGE_FIRST_ORDER = 'H';
    case POINTS_COUPON = 'F';
    case PERCENTAGE_COUPON = 'P';
    case PERCENTAGE_AND_FREE_DELIVERY_COUPON = 'X';
    case DISCOUNT_AND_FREE_DELIVERY_COUPON = 'C';
    case PRODUCT_PERCENTAGE = 'A';
    case PRODUCT_FIXED = 'B';
    case PRODUCT_FREE_DELIVERY = 'Y';
}
