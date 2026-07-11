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

            // snake_case Frontend aliases
            'banner_image_id' => $this->id,
            'banner_type' => $this->banner_type,
            'banner_type_id' => $this->banner_type_id,
            'event_date' => $this->event_date?->toISOString(),
            'event_date_end' => $this->event_date_end?->toISOString(),
            'event_title' => $this->event_title,
            'sort_order' => $this->sort_order,
            'language_id' => 1,
        ];
    }
}
