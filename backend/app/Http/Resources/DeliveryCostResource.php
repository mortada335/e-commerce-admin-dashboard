<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryCostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'city' => $this->city,
            'zone' => $this->zone,
            'cost' => (float) $this->cost,
            'freeDeliveryThreshold' => (float) $this->free_delivery_threshold,
            'estimatedDays' => $this->estimated_days,
            'status' => $this->status,
            
            // Front-End aliases
            'specialCost' => 0,
            'specialCostTotalOrder' => 0,
            'startDate' => $this->created_at?->toISOString(),
            'endDate' => null,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
