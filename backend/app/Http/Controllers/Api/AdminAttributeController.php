<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeDescription;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAttributeController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Attribute::class;
    protected array $searchFields = ['name'];
    protected array $filterFields = ['attribute_group_id'];

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'attribute_group_id' => 'required|integer',
            'attributes' => 'required|array',
            'attributes.*.language_id' => 'required|integer',
            'attributes.*.name' => 'required|string',
        ]);

        $attr = Attribute::create([
            'attribute_group_id' => $request->attribute_group_id,
            'name' => $request->attributes[0]['name'] ?? '',
        ]);

        foreach ($request->attributes as $desc) {
            AttributeDescription::create([
                'attribute_id' => $attr->id,
                'language_id'  => $desc['language_id'],
                'name'         => $desc['name'],
            ]);
        }

        return $this->successResponse($attr->load('descriptions'), null, 201);
    }
}
