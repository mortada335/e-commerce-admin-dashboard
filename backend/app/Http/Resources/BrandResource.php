<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'slug'            => $this->slug,
            'logo'            => $this->logo ? asset('storage/' . $this->logo) : null,
            'image'           => $this->logo ? asset('storage/' . $this->logo) : null, // Frontend alias
            'is_active'       => $this->is_active,
            'enabled'         => $this->is_active, // Frontend alias
            'sort_order'      => $this->sort_order,
            'manufacturer_id' => $this->id, // Frontend uses Manufacturer mapping logic
            'noindex'         => $this->noindex,
            'created_at'      => $this->created_at?->toISOString(),
            'updated_at'      => $this->updated_at?->toISOString(),
        ];
    }
}
