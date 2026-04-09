<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Role::with('permissions');

        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        $perPage = $request->input('page_size', 25);
        $roles = $query->paginate($perPage);

        return $this->successResponse($roles);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

        if ($request->filled('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return $this->successResponse($role->load('permissions'), null, 201);
    }

    public function show($id): JsonResponse
    {
        $role = Role::with('permissions')->findOrFail($id);
        return $this->successResponse($role);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        if ($request->filled('name')) {
            $role->update(['name' => $request->name]);
        }

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return $this->successResponse($role->load('permissions'));
    }

    public function destroy($id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return $this->successResponse(null, null, 200, 'Role deleted successfully.');
    }

    /**
     * POST /add_roles_to_user
     */
    public function addRolesToUser(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'roles'   => 'required|array',
            'roles.*' => 'string',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->syncRoles($request->roles);

        return $this->successResponse($user->load('roles', 'permissions'));
    }

    /**
     * POST /add_warehouses_to_user
     * Stub — stores warehouse IDs as JSON on the user model.
     */
    public function addWarehousesToUser(Request $request): JsonResponse
    {
        $request->validate([
            'user_id'      => 'required|integer|exists:users,id',
            'warehouse_ids' => 'required|array',
            'warehouse_ids.*' => 'integer',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->warehouse_ids = $request->warehouse_ids;
        $user->save();

        return $this->successResponse($user);
    }
}
