<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\OrderPointsHistory;
use App\Traits\AdminCrud;

class OrderPointsHistoryController extends Controller
{
    use AdminCrud;
    protected string $modelClass = OrderPointsHistory::class;
    protected array $filterFields = ['order_id', 'customer_id'];
}
