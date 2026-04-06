<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\AppIcon;
use App\Traits\AdminCrud;

class AppIconController extends Controller
{
    use AdminCrud;
    protected string $modelClass = AppIcon::class;
    protected array $searchFields = ['name'];
    protected array $filterFields = ['status'];
}
