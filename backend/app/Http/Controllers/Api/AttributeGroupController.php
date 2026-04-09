<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttributeGroup;
use App\Traits\AdminCrud;

class AttributeGroupController extends Controller
{
    use AdminCrud;

    protected string $modelClass = AttributeGroup::class;
    protected ?string $resourceClass = \App\Http\Resources\AttributeGroupResource::class;
    protected array $with = ['descriptions'];

    public function index(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $query = AttributeGroup::with($this->getWith())->withCount('attributes');
        $data = $query->paginate(min((int) $request->input('page_size', 20), 200));
        return $this->paginatedResponse($data);
    }
}
