<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user')->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('action', 'ilike', "%{$request->search}%")
                  ->orWhereHas('user', fn ($u) =>
                      $u->where('name', 'ilike', "%{$request->search}%")
                  );
            });
        }

        if ($request->action) {
            $query->where('action', $request->action);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(min((int) $request->get('per_page', 20), 100));

        return $this->successResponse(
            $logs->items(),
            $this->paginationMeta($logs)
        );
    }
}
