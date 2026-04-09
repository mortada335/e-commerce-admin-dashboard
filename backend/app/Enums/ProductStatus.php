<?php

namespace App\Enums;

enum ProductStatus: int
{
    case NEW = 0;
    case PROMOTED = 1;
    case FEATURED = 2;
    case DISCOUNT = 3;
    case NORMAL = 4;
}
