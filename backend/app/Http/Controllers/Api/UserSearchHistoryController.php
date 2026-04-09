<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserSearch;
use App\Traits\AdminCrud;

class UserSearchHistoryController extends Controller
{
    use AdminCrud;
    protected string $modelClass = UserSearch::class;
    protected array $filterFields = ['user_id'];
}
