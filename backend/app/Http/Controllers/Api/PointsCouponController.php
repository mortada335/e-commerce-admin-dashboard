<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PointsCoupon;
use App\Traits\AdminCrud;

class PointsCouponController extends Controller
{
    use AdminCrud;

    protected string $modelClass = PointsCoupon::class;
    protected array $searchFields = ['name', 'code'];
    protected array $filterFields = ['status', 'type'];
}
