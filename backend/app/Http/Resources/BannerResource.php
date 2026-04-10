<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'bannerImageId' => $this->id,
            'title' => $this->title,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'link' => $this->link,
            'target' => $this->target,
            'bannerType' => $this->banner_type,
            'bannerTypeId' => $this->banner_type_id,
            'eventDate' => $this->event_date?->toISOString(),
            'eventDateEnd' => $this->event_date_end?->toISOString(),
            'eventTitle' => $this->event_title,
            'sortOrder' => $this->sort_order,
            'languageId' => 1, // Defaulting to English alias
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
