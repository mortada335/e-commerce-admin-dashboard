<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slide;
use App\Traits\AdminCrud;

class SlideController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Slide::class;
    protected array $filterFields = ['status', 'language_id'];
}
