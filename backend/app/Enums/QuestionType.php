<?php

namespace App\Enums;

enum QuestionType: string
{
    case TEXT = 'text';
    case MULTI_SELECT = 'multi_select';
    case RADIO = 'radio';
}
