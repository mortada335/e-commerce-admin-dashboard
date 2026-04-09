<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScheduledNotification;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduledNotificationController extends Controller
{
    use AdminCrud;

    protected string $modelClass = ScheduledNotification::class;
    protected array $searchFields = ['title', 'body'];
    protected array $filterFields = ['status', 'is_approved'];

    public function approve(Request $request, $id): JsonResponse
    {
        $notification = ScheduledNotification::findOrFail($id);
        $notification->update([
            'is_approved' => true,
            'approved_by' => $request->user()?->id,
        ]);

        return $this->successResponse($notification->fresh());
    }
}
