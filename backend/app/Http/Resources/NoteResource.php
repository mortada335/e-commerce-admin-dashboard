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

            // camelCase Front-End aliases
            'dateAdded'     => $this->created_at?->toISOString(),
            'dateModified'  => $this->updated_at?->toISOString(),
            'bgColor'       => '#f0f0f0',
            'color' => '#000000',
            'icon' => 'info',
            'language' => 1,
            'type' => 'Info',
            'categoryName' => 'General',

            // snake_case Front-End aliases
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
            'date_added' => $this->created_at?->toISOString(),
            'date_modified' => $this->updated_at?->toISOString(),
            'bg_color' => '#f0f0f0',
            'category_name' => 'General',
        ];
    }
}
