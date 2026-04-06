<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\AdminCrud;

class CategoryAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Category::class;
    protected array $searchFields = ['name', 'description'];
    protected array $filterFields = ['parent_id', 'is_active', 'top'];
    protected array $with = ['children', 'parent'];
}
