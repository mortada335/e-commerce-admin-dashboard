<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Coupon::class;
    protected array $searchFields = ['name', 'code'];
    protected array $filterFields = ['status', 'type', 'logged'];
}
