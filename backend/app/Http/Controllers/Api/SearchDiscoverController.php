<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\SearchDiscover;
use App\Traits\AdminCrud;

class SearchDiscoverController extends Controller
{
    use AdminCrud;
    protected string $modelClass = SearchDiscover::class;
    protected array $searchFields = ['keyword'];
    protected array $filterFields = ['status', 'language_id'];
}
