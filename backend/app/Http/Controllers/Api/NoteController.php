<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ImportantNote;
use App\Traits\AdminCrud;

class NoteController extends Controller
{
    use AdminCrud;
    protected string $modelClass = ImportantNote::class;
    protected ?string $resourceClass = \App\Http\Resources\NoteResource::class;
    protected array $searchFields = ['title', 'description'];
    protected array $filterFields = ['status'];
}
