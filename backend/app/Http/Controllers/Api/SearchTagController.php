<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\SearchTag;
use App\Traits\AdminCrud;

class SearchTagController extends Controller
{
    use AdminCrud;
    protected string $modelClass = SearchTag::class;
    protected array $searchFields = ['tag'];
    protected array $filterFields = ['status', 'language_id'];
}
