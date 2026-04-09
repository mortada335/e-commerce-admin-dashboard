<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserRecentProduct;
use App\Traits\AdminCrud;

class UserRecentProductController extends Controller
{
    use AdminCrud;
    protected string $modelClass = UserRecentProduct::class;
    protected array $filterFields = ['user_id', 'product_id'];
}
