<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'type' => $this->type,
            'value' => (float) $this->value,
            'minOrderAmount' => $this->min_order_amount ? (float) $this->min_order_amount : null,
            'maxDiscountAmount' => $this->max_discount_amount ? (float) $this->max_discount_amount : null,
            'maxUses' => $this->max_uses,
            'usedCount' => $this->used_count,
            'maxUsesPerUser' => $this->max_uses_per_user,
            'isActive' => $this->is_active,
            'isValid' => $this->isValid(),
            'startsAt' => $this->starts_at?->toISOString(),
            'expiresAt' => $this->expires_at?->toISOString(),
            'createdAt' => $this->created_at?->toISOString(),

            // Front-End aliases
            'name' => $this->description ?? $this->code,
            'status' => $this->is_active,
            'discount' => (float) $this->value,
            'totalMin' => $this->min_order_amount ? (float) $this->min_order_amount : 0,
            'totalMax' => $this->max_discount_amount ? (float) $this->max_discount_amount : 0,
            'dateAdded' => $this->created_at?->toISOString(),
            'dateStart' => $this->starts_at?->toISOString(),
            'dateEnd' => $this->expires_at?->toISOString(),
        ];
    }
}
