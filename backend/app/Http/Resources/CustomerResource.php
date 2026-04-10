<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'fullName' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'gender' => $this->gender,
            'dateOfBirth' => $this->date_of_birth?->toDateString(),
            'isActive' => $this->is_active,
            'totalSpent' => $this->whenLoaded('orders', fn () => round($this->total_spent, 2), 0),
            'ordersCount' => $this->orders_count ?? null,
            'address' => [
                'line1' => $this->address_line1,
                'line2' => $this->address_line2,
                'city' => $this->city,
                'state' => $this->state,
                'country' => $this->country,
                'zip' => $this->zip,
            ],
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
