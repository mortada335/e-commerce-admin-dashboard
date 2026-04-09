<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\AppIcon;
use App\Traits\AdminCrud;

class AppIconController extends Controller
{
    use AdminCrud;
    protected string $modelClass = AppIcon::class;
    protected ?string $resourceClass = \App\Http\Resources\AppIconResource::class;
    protected array $searchFields = ['name'];
    protected array $filterFields = ['status'];
}
