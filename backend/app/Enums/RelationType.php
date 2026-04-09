<?php

namespace App\Enums;

enum RelationType: string
{
    case SAME_CATEGORY = 'category';
    case SAME_BRAND = 'brand';
}
