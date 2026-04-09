<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if ($this->has('description')) {
            $this->merge([
                'description' => strip_tags($this->description, '<p><br><strong><em><ul><li><ol><h1><h2><h3><h4><h5><h6><blockquote><a>'),
            ]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('product');
        return [
            'name'                => 'sometimes|string|max:255',
            'description'         => 'nullable|string',
            'short_description'   => 'nullable|string|max:500',
            'price'               => 'sometimes|numeric|min:0',
            'discount_price'      => 'nullable|numeric|min:0',
            'sku'                 => "sometimes|string|max:100|unique:products,sku,{$id}",
            'stock_quantity'      => 'sometimes|integer|min:0',
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
