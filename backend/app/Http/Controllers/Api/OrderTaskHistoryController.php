<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderTaskHistory;
use App\Traits\AdminCrud;

class OrderTaskHistoryController extends Controller
{
    use AdminCrud;

    protected string $modelClass = OrderTaskHistory::class;
    protected array $filterFields = ['order_id', 'status'];
}
