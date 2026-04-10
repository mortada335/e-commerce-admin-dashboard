<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'startDate' => $this->start_date?->toISOString(),
            'endDate' => $this->end_date?->toISOString(),
            'createdAt' => $this->created_at?->toISOString(),

            // Front-End aliases
            'dateAdded'     => $this->created_at?->toISOString(),
            'dateModified'  => $this->updated_at?->toISOString(),
            'bgColor'       => '#f0f0f0',
            'color' => '#000000',
            'icon' => 'info',
            'language' => 1,
            'type' => 'Info',
            'categoryName' => 'General',
        ];
    }
}
