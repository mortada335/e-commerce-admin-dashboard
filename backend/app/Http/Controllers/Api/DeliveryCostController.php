<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\DeliveryCost;
use App\Traits\AdminCrud;

class DeliveryCostController extends Controller
{
    use AdminCrud;
    protected string $modelClass = DeliveryCost::class;
    protected ?string $resourceClass = \App\Http\Resources\DeliveryCostResource::class;
    protected array $searchFields = ['city'];
    protected array $filterFields = ['zone', 'status'];
}
