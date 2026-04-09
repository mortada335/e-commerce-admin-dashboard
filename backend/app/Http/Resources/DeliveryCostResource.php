<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryCostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                       => $this->id,
            'city'                     => $this->city,
            'zone'                     => $this->zone,
            'cost'                     => (float) $this->cost,
            'free_delivery_threshold'  => (float) $this->free_delivery_threshold,
            'estimated_days'           => $this->estimated_days,
            'status'                   => $this->status,
            
            // Front-End aliases
            'special_cost'             => 0,
            'special_cost_total_order' => 0,
            'start_date'               => $this->created_at?->toISOString(),
            'end_date'                 => null,
            'created_at'               => $this->created_at?->toISOString(),
        ];
    }
}
