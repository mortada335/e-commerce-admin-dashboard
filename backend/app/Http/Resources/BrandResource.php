<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logo ? asset('storage/' . $this->logo) : null,
            'image' => $this->logo ? asset('storage/' . $this->logo) : null, // Frontend alias
            'isActive' => $this->is_active,
            'enabled' => $this->is_active, // Frontend alias
            'sortOrder' => $this->sort_order,
            'manufacturerId' => $this->id, // Frontend uses Manufacturer mapping logic
            'noindex' => $this->noindex,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
