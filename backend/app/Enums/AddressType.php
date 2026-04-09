<?php

namespace App\Enums;

enum AddressType: int
{
    case HOME = 0;
    case WORK = 1;
    case OTHER = 2;
}
