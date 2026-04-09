<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OptionTypeValue;
use App\Traits\AdminCrud;

class ProductOptionTypeValueController extends Controller
{
    use AdminCrud;

    protected string $modelClass = OptionTypeValue::class;
    protected array $filterFields = ['option_type_id'];
    protected array $with = ['descriptions', 'optionType'];
}
