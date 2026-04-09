<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();

        if ($user->is_active === false) {
            Auth::logout();
            return $this->errorResponse('FORBIDDEN', 'Account is deactivated.', null, 403);
        }

        $ability = $user->hasRole('admin') ? '*' : implode(',', $user->getAllPermissions()->pluck('name')->toArray());
        $token = $user->createToken('api-token', [$ability])->plainTextToken;

        ActivityLog::record('logged_in');

        return $this->successResponse([
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'avatar' => $user->avatar,
                'roles'  => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles', 'permissions');
        return $this->successResponse([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'avatar'      => $user->avatar,
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        ActivityLog::record('logged_out');
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, null, 200, 'Logged out successfully.');
    }
}
