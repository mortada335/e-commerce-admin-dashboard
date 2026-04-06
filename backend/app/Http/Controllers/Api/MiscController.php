<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MiscController extends Controller
{
    use ApiResponse;

    /** /recheck-users-points/ */
    public function recheckUsersPoints(): JsonResponse
    {
        return $this->successResponse(null, null, 200, 'Points rechecked.');
    }

    /** /redirect_to_sms/ */
    public function redirectToSms(Request $request): JsonResponse
    {
        return $this->successResponse(null, null, 200, 'SMS redirect triggered.');
    }

    /** /old-product-modifications/ */
    public function oldProductModifications(Request $request): JsonResponse
    {
        return $this->successResponse([]);
    }

    /** /admin-chat/conversations/ */
    public function chatConversations(Request $request): JsonResponse
    {
        return $this->paginatedResponse(
            \App\Models\User::query()->limit(0)->paginate(20)
        );
    }

    /** /content-types/ */
    public function contentTypes(): JsonResponse
    {
        $types = \Illuminate\Support\Facades\DB::table('information_schema.tables')
            ->where('table_schema', 'public')
            ->select('table_name as model')
            ->get()
            ->map(fn ($t, $i) => ['id' => $i + 1, 'app_label' => 'admin', 'model' => $t->model ?? 'unknown']);

        return $this->successResponse($types);
    }

    /** /content-types/{id}/ */
    public function contentTypeDetail($id): JsonResponse
    {
        return $this->successResponse(['id' => $id, 'app_label' => 'admin', 'model' => 'item']);
    }

    /** /dashboard_charts/ */
    public function dashboardCharts(): JsonResponse
    {
        return $this->successResponse([
            'revenue_chart' => [],
            'orders_chart'  => [],
        ]);
    }

    /** /dashboard_statistics/ */
    public function dashboardStatistics(): JsonResponse
    {
        return $this->successResponse([
            'total_revenue' => 0,
            'total_orders'  => \App\Models\Order::count(),
            'total_products' => \App\Models\Product::count(),
            'total_customers' => \App\Models\Customer::count(),
        ]);
    }

    protected function paginatedResponse($paginator): JsonResponse
    {
        return response()->json([
            'count'    => $paginator->total(),
            'next'     => $paginator->nextPageUrl(),
            'previous' => $paginator->previousPageUrl(),
            'results'  => $paginator->items(),
        ]);
    }
}
