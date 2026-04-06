<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryServiceController extends Controller
{
    use ApiResponse;

    public function getAreas(Request $request): JsonResponse
    {
        // Stub — integrate with actual delivery service API
        return $this->successResponse([
            ['id' => 1, 'name' => 'Baghdad - Karkh'],
            ['id' => 2, 'name' => 'Baghdad - Rusafa'],
        ]);
    }

    public function getCities(): JsonResponse
    {
        return $this->successResponse([
            ['id' => 1, 'name' => 'Baghdad'],
            ['id' => 2, 'name' => 'Basra'],
            ['id' => 3, 'name' => 'Erbil'],
        ]);
    }

    public function publishShipment(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|integer',
        ]);

        // Stub — integrate with actual delivery service
        return $this->successResponse([
            'shipment_id' => 'SHP-' . uniqid(),
            'order_id'    => $request->order_id,
            'status'      => 'published',
        ], null, 201);
    }
}
