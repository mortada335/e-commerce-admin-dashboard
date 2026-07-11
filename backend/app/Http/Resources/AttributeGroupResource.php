<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttributeGroupResource extends JsonResource
{
    public function toArray($request): array
    {
        $descriptions = $this->descriptions;
        $nameArabic = $descriptions->where('language_id', 2)->first()?->name;
        $nameEnglish = $descriptions->where('language_id', 1)->first()?->name;

        return [
            'id' => $this->id,
            'name' => $nameEnglish ?? $this->name ?? 'N/A',
            'sortOrder' => $this->sort_order,
            
            // camelCase Front-End aliases
            'nameArabic'        => $nameArabic ?? $nameEnglish ?? $this->name ?? 'N/A',
            'nameEnglish'       => $nameEnglish ?? $this->name ?? 'N/A',
            'numOfAttributes' => $this->attributes_count ?? 0,
            'createdAt' => $this->created_at?->toISOString(),

            // snake_case Front-End aliases
            'attribute_group_id' => $this->id,
            'sort_order' => $this->sort_order,
            'num_of_attributes' => $this->attributes_count ?? 0,
        ];
    }
}
