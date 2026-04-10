<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'shortDescription' => $this->short_description,
            'price' => (float) $this->price,
            'discountPrice' => $this->discount_price ? (float) $this->discount_price : null,
            'effectivePrice' => (float) $this->effective_price,
            'sku' => $this->sku,
            'stockQuantity' => $this->stock_quantity,
            'lowStockThreshold' => $this->low_stock_threshold,
            'maxCartQuantity' => $this->max_cart_quantity,
            'isLowStock' => $this->isLowStock(),
            'status' => $this->status,
            'isFeatured' => $this->is_featured,
            'isNew' => $this->is_new,
            'isEnabled' => $this->is_enabled,
            'weight' => $this->weight,
            'meta' => $this->meta,
            'notes' => $this->notes,
            'discountStartDate' => $this->discount_start_date?->toISOString(),
            'discountExpiryDate' => $this->discount_expiry_date?->toISOString(),
            'discountRemainingQty' => $this->discount_remaining_qty,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'images' => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'altText' => $img->alt_text,
                    'sortOrder' => $img->sort_order,
                    'isPrimary' => $img->is_primary,
                ])
            ),
            'variants' => $this->whenLoaded('variants', fn () =>
                $this->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'sku' => $v->sku,
                    'price' => (float) $v->price,
                    'stockQuantity' => $v->stock_quantity,
                    'isActive' => $v->is_active,
                ])
            ),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),

            // Frontend aliases
            'productId' => $this->id,
            'model' => $this->sku ?? $this->name,
            'quantityAvilable' => $this->stock_quantity,
            'discountedPrice' => $this->discount_price,
            'discounted' => !empty($this->discount_price),
            'dateAdded' => $this->created_at?->toISOString(),
            'dateModified' => $this->updated_at?->toISOString(),
            'newProduct' => $this->is_new,
            'enabled' => $this->is_enabled,
            'hasPoints' => false,
            'productData'       => [
                'productId' => $this->id,
                'description' => [['name' => $this->name]],
            ],
            'product' => $this->name,
        ];
    }
}
