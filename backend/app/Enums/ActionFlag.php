<?php

namespace App\Enums;

enum ActionFlag: int
{
    case ADDITION = 1;
    case CHANGE = 2;
    case DELETION = 3;
}
