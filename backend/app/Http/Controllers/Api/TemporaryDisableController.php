<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TemporaryDisable;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemporaryDisableController extends Controller
{
    use AdminCrud;

    protected string $modelClass = TemporaryDisable::class;

    public function createDisable(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['created_by'] = $request->user()?->id;
        $item = TemporaryDisable::create($data);
        return $this->successResponse($item, null, 201);
    }

    public function cancel($id): JsonResponse
    {
        $item = TemporaryDisable::findOrFail($id);
        $item->update(['is_cancelled' => true]);
        return $this->successResponse($item->fresh());
    }

    public function products($id): JsonResponse
    {
        $item = TemporaryDisable::findOrFail($id);
        return $this->successResponse($item->product_ids ?? []);
    }
}
