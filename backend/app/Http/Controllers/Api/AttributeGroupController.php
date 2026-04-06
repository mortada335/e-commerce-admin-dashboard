<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttributeGroup;
use App\Traits\AdminCrud;

class AttributeGroupController extends Controller
{
    use AdminCrud;

    protected string $modelClass = AttributeGroup::class;
    protected array $with = ['descriptions'];
}
