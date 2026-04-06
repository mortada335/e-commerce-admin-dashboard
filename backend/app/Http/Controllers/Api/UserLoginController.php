<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserLogin;
use App\Traits\AdminCrud;

class UserLoginController extends Controller
{
    use AdminCrud;

    protected string $modelClass = UserLogin::class;
    protected array $searchFields = ['ip_address'];
    protected array $filterFields = ['user_id'];
    protected array $with = ['user'];
}
