<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVideo;
use App\Traits\AdminCrud;

class ProductVideoController extends Controller
{
    use AdminCrud;

    protected string $modelClass = ProductVideo::class;
    protected array $filterFields = ['product_id'];
}
