<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'full_name'  => $this->full_name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'avatar'     => $this->avatar,
            'gender'     => $this->gender,
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'is_active'  => $this->is_active,
            'total_spent' => $this->whenLoaded('orders', fn () => round($this->total_spent, 2), 0),
            'orders_count'=> $this->orders_count ?? null,
            'address' => [
                'line1'   => $this->address_line1,
                'line2'   => $this->address_line2,
                'city'    => $this->city,
                'state'   => $this->state,
                'country' => $this->country,
                'zip'     => $this->zip,
            ],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
