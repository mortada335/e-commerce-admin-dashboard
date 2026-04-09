<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserCart;
use App\Traits\AdminCrud;

class UserCartController extends Controller
{
    use AdminCrud;
    protected string $modelClass = UserCart::class;
    protected array $filterFields = ['customer_id', 'product_id'];
}
