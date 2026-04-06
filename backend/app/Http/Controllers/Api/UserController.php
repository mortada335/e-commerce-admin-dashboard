<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserLogin;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    use AdminCrud;

    protected string $modelClass = User::class;
    protected array $searchFields = ['name', 'email'];
    protected array $filterFields = ['is_active'];
    protected array $with = ['roles'];

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->successResponse($user, null, 201);
    }

    public function createAdmin(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('admin');

        return $this->successResponse($user->load('roles'), null, 201);
    }

    public function changeStatus(Request $request): JsonResponse
    {
        $request->validate([
            'user_id'   => 'required|integer|exists:users,id',
            'is_active' => 'required|boolean',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->update(['is_active' => $request->is_active]);

        return $this->successResponse($user);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return $this->errorResponse('INVALID_PASSWORD', 'Old password is incorrect.', null, 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return $this->successResponse(null, null, 200, 'Password changed successfully.');
    }

    public function deletedUsers(Request $request): JsonResponse
    {
        $query = User::onlyTrashed();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"));
        }

        $pageSize = min((int) $request->input('page_size', 20), 200);
        $data = $query->latest('deleted_at')->paginate($pageSize);

        return $this->paginatedResponse($data);
    }

    public function deletedUserDetail($id): JsonResponse
    {
        $user = User::onlyTrashed()->findOrFail($id);
        return $this->successResponse($user);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $users = User::with('roles')->get();

        return response()->streamDownload(function () use ($users) {
            $h = fopen('php://output', 'w');
            fputcsv($h, ['ID', 'Name', 'Email', 'Roles', 'Active', 'Created At']);
            foreach ($users as $u) {
                fputcsv($h, [
                    $u->id, $u->name, $u->email,
                    $u->getRoleNames()->implode(', '),
                    $u->is_active ? 'Yes' : 'No',
                    $u->created_at?->toDateTimeString(),
                ]);
            }
            fclose($h);
        }, 'users-' . now()->format('Y-m-d') . '.csv', ['Content-Type' => 'text/csv']);
    }

    public function exportCsvDetail($id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);
        return $this->successResponse($user);
    }
}
