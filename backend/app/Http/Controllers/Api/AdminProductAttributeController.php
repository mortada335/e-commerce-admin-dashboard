<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductAttribute;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductAttributeController extends Controller
{
    use AdminCrud;

    protected string $modelClass = ProductAttribute::class;
    protected array $searchFields = ['text'];
    protected array $filterFields = ['product_id', 'attribute_id', 'language_id'];

    public function deleteAttribute(Request $request): JsonResponse
    {
        $request->validate([
            'product_id'   => 'required|integer',
            'attribute_id' => 'required|integer',
        ]);

        ProductAttribute::where('product_id', $request->product_id)
            ->where('attribute_id', $request->attribute_id)
            ->delete();

        return response()->json(null, 204);
    }
}
