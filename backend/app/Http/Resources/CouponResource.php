<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                 => $this->id,
            'code'               => $this->code,
            'description'        => $this->description,
            'type'               => $this->type,
            'value'              => (float) $this->value,
            'min_order_amount'   => $this->min_order_amount ? (float) $this->min_order_amount : null,
            'max_discount_amount'=> $this->max_discount_amount ? (float) $this->max_discount_amount : null,
            'max_uses'           => $this->max_uses,
            'used_count'         => $this->used_count,
            'max_uses_per_user'  => $this->max_uses_per_user,
            'is_active'          => $this->is_active,
            'is_valid'           => $this->isValid(),
            'starts_at'          => $this->starts_at?->toISOString(),
            'expires_at'         => $this->expires_at?->toISOString(),
            'created_at'         => $this->created_at?->toISOString(),
        ];
    }
}
