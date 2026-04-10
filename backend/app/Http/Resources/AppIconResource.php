<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AppIconResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'iconUrl' => $this->icon_url,
            'link' => $this->link,
            'sortOrder' => $this->sort_order,
            'status' => $this->status,
            'isActive' => (bool) $this->status,
            'platform' => 3, // Default to 'Both' based on user enums
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
