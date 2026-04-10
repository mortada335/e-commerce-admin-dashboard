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
            
            // Front-End aliases
            'nameArabic'        => $nameArabic ?? $nameEnglish ?? $this->name ?? 'N/A',
            'nameEnglish'       => $nameEnglish ?? $this->name ?? 'N/A',
            'numOfAttributes' => $this->attributes_count ?? 0,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
