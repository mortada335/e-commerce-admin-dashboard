<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'email'         => $this->email,
            'is_active'     => $this->is_active,
            'warehouse_ids' => $this->warehouse_ids,
            'avatar'        => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
            'deleted_at'    => $this->deleted_at?->toISOString(),
            
            // Front-End aliases
            'first_name'    => explode(' ', $this->name ?? '', 2)[0] ?? '',
            'last_name'     => explode(' ', $this->name ?? '', 2)[1] ?? '',
            'username'      => $this->email,
            'status'        => $this->is_active,
            'phone_number'  => $this->phone ?? 'N/A',
            'is_staff'      => $this->hasRole(['admin', 'manager', 'staff']),
            'dateJoined'    => $this->created_at?->toISOString(),
            'date_deleted'  => $this->deleted_at?->toISOString(),
            'ltv'           => 0, // Mock LTV
            
            'roles'         => $this->roles->pluck('name'),
            'permissions'   => $this->whenLoaded('permissions', fn() => $this->getAllPermissions()->pluck('name')),
        ];
    }
}
