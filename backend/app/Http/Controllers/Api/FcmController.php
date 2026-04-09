<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FcmController extends Controller
{
    use ApiResponse;

    public function deliveryData(Request $request): JsonResponse
    {
        // Stub — returns FCM delivery metrics
        return $this->successResponse([
            'total_sent'     => 0,
            'total_delivered' => 0,
            'total_failed'   => 0,
        ]);
    }
}
