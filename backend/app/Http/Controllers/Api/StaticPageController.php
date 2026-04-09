<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use App\Traits\AdminCrud;

class StaticPageController extends Controller
{
    use AdminCrud;
    protected string $modelClass = StaticPage::class;
    protected array $searchFields = ['title', 'content'];
    protected array $filterFields = ['status', 'language_id'];
}
