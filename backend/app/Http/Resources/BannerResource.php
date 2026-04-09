<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'banner_image_id' => $this->id,
            'title'           => $this->title,
            'image'           => $this->image ? asset('storage/' . $this->image) : null,
            'link'            => $this->link,
            'target'          => $this->target,
            'banner_type'     => $this->banner_type,
            'banner_type_id'  => $this->banner_type_id,
            'event_date'      => $this->event_date?->toISOString(),
            'event_date_end'  => $this->event_date_end?->toISOString(),
            'event_title'     => $this->event_title,
            'sort_order'      => $this->sort_order,
            'language_id'     => 1, // Defaulting to English alias
            'created_at'      => $this->created_at?->toISOString(),
        ];
    }
}
