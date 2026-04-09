<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Traits\AdminCrud;

class BannerAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Banner::class;
    protected ?string $resourceClass = \App\Http\Resources\BannerResource::class;
    protected array $searchFields = ['title'];
    protected array $filterFields = ['type', 'status', 'position'];
}
