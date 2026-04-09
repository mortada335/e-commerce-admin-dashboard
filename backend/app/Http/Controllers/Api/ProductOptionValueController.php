<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductOptionValue;
use App\Traits\AdminCrud;

class ProductOptionValueController extends Controller
{
    use AdminCrud;

    protected string $modelClass = ProductOptionValue::class;
    protected array $filterFields = ['product_id', 'option_type_id'];
}
