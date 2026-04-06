<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    use ApiResponse;

    public function addPermissionsToUser(Request $request): JsonResponse
    {
        $request->validate([
            'user_id'     => 'required|integer|exists:users,id',
            'permissions' => 'required|array',
            'permissions.*' => 'string',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->syncPermissions($request->permissions);

        return $this->successResponse($user->load('permissions'));
    }

    public function modelsPermissions(): JsonResponse
    {
        $permissions = Permission::all()->groupBy(function ($p) {
            $parts = explode(' ', $p->name);
            return end($parts);
        });

        return $this->successResponse($permissions);
    }
}
