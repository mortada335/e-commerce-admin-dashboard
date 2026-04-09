<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use App\Traits\AdminCrud;

class ProductImageAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = ProductImage::class;
    protected array $filterFields = ['product_id'];
}
