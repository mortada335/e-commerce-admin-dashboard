<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'isActive' => $this->is_active,
            'sortOrder' => $this->sort_order,
            'parentId' => $this->parent_id,
            'parent' => $this->whenLoaded('parent', fn () => $this->parent ? [
                'id' => $this->parent->id,
                'name' => $this->parent->name,
            ] : null),
            'children' => $this->whenLoaded('children', fn () =>
                CategoryResource::collection($this->children)
            ),
            'productsCount' => $this->products_count ?? null,
            
            // Frontend aliases
            'nameArabic'           => $this->name,
            'nameEnglish'          => $this->name,
            'descriptionArabic'    => $this->description,
            'descriptionEnglish'   => $this->description,
            'numOfProducts' => $this->products_count ?? 0,
            'parentCategoryName' => $this->whenLoaded('parent', fn () => $this->parent ? $this->parent->name : 'None', 'None'),
            'sortOrder'            => $this->sort_order,
            'status' => $this->is_active,
            'color' => null,
            'transparency' => null,

            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
