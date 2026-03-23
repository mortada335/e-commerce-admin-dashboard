<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'image'       => $this->image ? asset('storage/' . $this->image) : null,
            'is_active'   => $this->is_active,
            'sort_order'  => $this->sort_order,
            'parent_id'   => $this->parent_id,
            'parent'      => $this->whenLoaded('parent', fn () => $this->parent ? [
                'id'   => $this->parent->id,
                'name' => $this->parent->name,
            ] : null),
            'children'      => $this->whenLoaded('children', fn () =>
                CategoryResource::collection($this->children)
            ),
            'products_count'=> $this->products_count ?? null,
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
