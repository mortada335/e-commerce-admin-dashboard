<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'email'        => 'required|email|unique:customers,email',
            'phone'        => 'nullable|string|max:30',
            'gender'       => 'nullable|in:male,female,other',
            'date_of_birth'=> 'nullable|date',
            'is_active'    => 'boolean',
            'address_line1'=> 'nullable|string|max:255',
            'address_line2'=> 'nullable|string|max:255',
            'city'         => 'nullable|string|max:100',
            'state'        => 'nullable|string|max:100',
            'country'      => 'nullable|string|max:2',
            'zip'          => 'nullable|string|max:20',
        ];
    }
}
