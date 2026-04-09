<?php

namespace App\Enums;

enum AuditAction: int
{
    case CREATE = 0;
    case UPDATE = 1;
    case DELETE = 2;
    case ACCESS = 3;
}
