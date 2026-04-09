<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderExcelController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Order::class;
    protected array $with = ['customer', 'items'];

    public function index(Request $request): JsonResponse
    {
        $query = Order::with($this->getWith());

        foreach (['status', 'payment_status', 'customer_id', 'device_type', 'payment_method'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        if ($request->filled('date_added_after')) {
            $query->whereDate('created_at', '>=', $request->date_added_after);
        }
        if ($request->filled('date_added_before')) {
            $query->whereDate('created_at', '<=', $request->date_added_before);
        }

        if ($request->filled('ordering')) {
            $ord = $request->ordering;
            $dir = str_starts_with($ord, '-') ? 'desc' : 'asc';
            $query->orderBy(ltrim($ord, '-'), $dir);
        } else {
            $query->latest();
        }

        $pageSize = min((int) $request->input('page_size', 20), 200);
        return $this->paginatedResponse($query->paginate($pageSize));
    }
}
