<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Traits\AdminCrud;

class BrandAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Brand::class;
    protected array $searchFields = ['name'];
    protected array $filterFields = ['status'];
}
