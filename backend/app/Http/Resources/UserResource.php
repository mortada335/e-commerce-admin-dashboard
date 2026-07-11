<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'isActive' => $this->is_active,
            'warehouseIds' => $this->warehouse_ids,
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'deletedAt' => $this->deleted_at?->toISOString(),
            
            // camelCase Front-End aliases
            'firstName' => explode(' ', $this->name ?? '', 2)[0] ?? '',
            'lastName' => explode(' ', $this->name ?? '', 2)[1] ?? '',
            'username' => $this->email,
            'status' => $this->is_active,
            'phoneNumber' => $this->phone ?? 'N/A',
            'isStaff' => $this->hasRole(['admin', 'manager', 'staff']),
            'dateJoined'    => $this->created_at?->toISOString(),
            'dateDeleted' => $this->deleted_at?->toISOString(),
            'ltv' => 0, // Mock LTV

            // snake_case Front-End aliases
            'first_name' => explode(' ', $this->name ?? '', 2)[0] ?? '',
            'last_name' => explode(' ', $this->name ?? '', 2)[1] ?? '',
            'is_active' => $this->is_active,
            'is_staff' => $this->hasRole(['admin', 'manager', 'staff']),
            'phone_number' => $this->phone ?? 'N/A',
            'date_joined' => $this->created_at?->toISOString(),
            'date_deleted' => $this->deleted_at?->toISOString(),
            
            'roles' => $this->roles->pluck('name'),
            'permissions' => $this->whenLoaded('permissions', fn() => $this->getAllPermissions()->pluck('name')),
        ];
    }
}
