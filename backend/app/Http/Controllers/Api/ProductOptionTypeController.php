<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OptionType;
use App\Traits\AdminCrud;

class ProductOptionTypeController extends Controller
{
    use AdminCrud;

    protected string $modelClass = OptionType::class;
    protected array $with = ['descriptions', 'values'];
}
