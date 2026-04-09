<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderProduct;
use App\Traits\AdminCrud;

class OrderProductController extends Controller
{
    use AdminCrud;

    protected string $modelClass = OrderProduct::class;
    protected array $filterFields = ['order_id', 'product_id'];
    protected array $with = ['order', 'product'];
}
