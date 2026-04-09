<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FirebaseNotification;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FirebaseNotificationController extends Controller
{
    use AdminCrud;

    protected string $modelClass = FirebaseNotification::class;
    protected array $searchFields = ['title', 'body'];
    protected array $filterFields = ['status'];

    public function sendToAll(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string',
            'body'  => 'required|string',
        ]);

        $notification = FirebaseNotification::create([
            'title'      => $request->title,
            'title_ar'   => $request->title_ar,
            'body'       => $request->body,
            'body_ar'    => $request->body_ar,
            'image'      => $request->image,
            'link'       => $request->link,
            'topic'      => 'all',
            'status'     => 1,
            'sent_at'    => now(),
            'created_by' => $request->user()?->id,
        ]);

        // In production, dispatch a job to send via Firebase Cloud Messaging
        return $this->successResponse($notification, null, 201);
    }
}
