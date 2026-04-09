<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        return $this->successResponse([
            'current_page' => 1,
            'data' => [],
            'total' => 0,
            'per_page' => $request->input('page_size', 25),
            'last_page' => 1,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        return $this->successResponse(['message' => 'Warehouse created.'], null, 201);
    }

    public function show($id): JsonResponse
    {
        return $this->successResponse(['id' => $id, 'name' => 'Warehouse ' . $id]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        return $this->successResponse(['id' => $id, 'message' => 'Warehouse updated.']);
    }

    public function partialUpdate(Request $request, $id): JsonResponse
    {
        return $this->successResponse(['id' => $id, 'message' => 'Warehouse partially updated.']);
    }

    public function destroy($id): JsonResponse
    {
        return $this->successResponse(null, null, 200, 'Warehouse deleted.');
    }

    /**
     * GET /warehouse_zones_admin
     */
    public function zones(Request $request): JsonResponse
    {
        return $this->successResponse([
            'current_page' => 1,
            'data' => [],
            'total' => 0,
            'per_page' => $request->input('page_size', 25),
            'last_page' => 1,
        ]);
    }

    /**
     * POST /warehouse_zones_admin
     */
    public function storeZone(Request $request): JsonResponse
    {
        return $this->successResponse(['message' => 'Zone created.'], null, 201);
    }

    /**
     * PATCH /warehouse_zones_admin/{id}
     */
    public function updateZone(Request $request, $id): JsonResponse
    {
        return $this->successResponse(['id' => $id, 'message' => 'Zone updated.']);
    }
}
