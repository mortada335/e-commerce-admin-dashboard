<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'attributeGroupId' => $this->attribute_group_id,
            
            // Front-End aliases
            'nameArabic'           => $this->name,
            'nameEnglish'          => $this->name,
            'attributeGroupName' => $this->group?->name ?? 'N/A',
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
