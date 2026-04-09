<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AppIconResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'icon_url'   => $this->icon_url,
            'link'       => $this->link,
            'sort_order' => $this->sort_order,
            'status'     => $this->status,
            'is_active'  => (bool) $this->status,
            'platform'   => 3, // Default to 'Both' based on user enums
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
