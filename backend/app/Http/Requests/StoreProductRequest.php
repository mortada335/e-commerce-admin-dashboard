<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'short_description'   => 'nullable|string|max:500',
            'price'               => 'required|numeric|min:0',
            'discount_price'      => 'nullable|numeric|min:0|lt:price',
            'sku'                 => 'required|string|max:100|unique:products,sku',
            'stock_quantity'      => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'category_id'         => 'nullable|exists:categories,id',
            'status'              => 'in:active,inactive,draft',
            'is_featured'         => 'boolean',
            'weight'              => 'nullable|numeric|min:0',
            'meta'                => 'nullable|array',
            'images'              => 'nullable|array|max:10',
            'images.*'            => 'image|mimes:jpeg,png,webp|max:5120',
        ];
    }
}
