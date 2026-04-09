<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,
            'status'        => $this->status,
            'start_date'    => $this->start_date?->toISOString(),
            'end_date'      => $this->end_date?->toISOString(),
            'created_at'    => $this->created_at?->toISOString(),

            // Front-End aliases
            'dateAdded'     => $this->created_at?->toISOString(),
            'dateModified'  => $this->updated_at?->toISOString(),
            'bgColor'       => '#f0f0f0',
            'color'         => '#000000',
            'icon'          => 'info',
            'language'      => 1,
            'type'          => 'Info',
            'category_name' => 'General',
        ];
    }
}
