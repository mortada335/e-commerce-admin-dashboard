<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                   => $this->id,
            'name'                 => $this->name,
            'type'                 => $this->type,
            'attribute_group_id'   => $this->attribute_group_id,
            
            // Front-End aliases
            'nameArabic'           => $this->name,
            'nameEnglish'          => $this->name,
            'attribute_group_name' => $this->group?->name ?? 'N/A',
            'created_at'           => $this->created_at?->toISOString(),
        ];
    }
}
