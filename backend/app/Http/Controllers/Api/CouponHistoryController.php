<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CouponHistory;
use App\Traits\AdminCrud;

class CouponHistoryController extends Controller
{
    use AdminCrud;

    protected string $modelClass = CouponHistory::class;
    protected array $filterFields = ['coupon_id', 'customer_id', 'order_id'];
}
