<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'slug'                => $this->slug,
            'description'         => $this->description,
            'short_description'   => $this->short_description,
            'price'               => (float) $this->price,
            'discount_price'      => $this->discount_price ? (float) $this->discount_price : null,
            'effective_price'     => (float) $this->effective_price,
            'sku'                 => $this->sku,
            'stock_quantity'      => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'max_cart_quantity'   => $this->max_cart_quantity,
            'is_low_stock'        => $this->isLowStock(),
            'status'              => $this->status,
            'is_featured'         => $this->is_featured,
            'is_new'              => $this->is_new,
            'is_enabled'          => $this->is_enabled,
            'weight'              => $this->weight,
            'meta'                => $this->meta,
            'notes'               => $this->notes,
            'discount_start_date'  => $this->discount_start_date?->toISOString(),
            'discount_expiry_date' => $this->discount_expiry_date?->toISOString(),
            'discount_remaining_qty' => $this->discount_remaining_qty,
            'category'            => $this->whenLoaded('category', fn () => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'images'    => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id'         => $img->id,
                    'url'        => $img->url,
                    'alt_text'   => $img->alt_text,
                    'sort_order' => $img->sort_order,
                    'is_primary' => $img->is_primary,
                ])
            ),
            'variants'  => $this->whenLoaded('variants', fn () =>
                $this->variants->map(fn ($v) => [
                    'id'             => $v->id,
                    'sku'            => $v->sku,
                    'price'          => (float) $v->price,
                    'stock_quantity' => $v->stock_quantity,
                    'is_active'      => $v->is_active,
                ])
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Frontend aliases
            'product_id'        => $this->id,
            'model'             => $this->sku ?? $this->name,
            'quantity_avilable' => $this->stock_quantity,
            'discounted_price'  => $this->discount_price,
            'discounted'        => !empty($this->discount_price),
            'date_added'        => $this->created_at?->toISOString(),
            'date_modified'     => $this->updated_at?->toISOString(),
            'new_product'       => $this->is_new,
            'enabled'           => $this->is_enabled,
            'has_points'        => false,
            'productData'       => [
                'product_id'  => $this->id,
                'description' => [['name' => $this->name]],
            ],
            'product'           => $this->name,
        ];
    }
}
