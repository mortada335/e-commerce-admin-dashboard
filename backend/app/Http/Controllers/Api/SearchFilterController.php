<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\SearchFilter;
use App\Traits\AdminCrud;

class SearchFilterController extends Controller
{
    use AdminCrud;
    protected string $modelClass = SearchFilter::class;
    protected array $searchFields = ['name'];
    protected array $filterFields = ['status', 'filter_type', 'language_id'];
}
