<?php

namespace App\Enums;

enum SectionType: int
{
    case PRODUCTS_BY_CATEGORY = 1;
    case PRODUCTS_BY_STATUS = 2;
    case PRODUCTS_BY_BRANDS = 3;
    case SUB_CATEGORIES = 4;
    case SUB_CATEGORY_AND_PRODUCTS = 5;
    case FLASH_SALE = 6;
}
