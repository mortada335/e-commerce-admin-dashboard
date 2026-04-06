<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserRank;
use App\Traits\AdminCrud;

class UserRankController extends Controller
{
    use AdminCrud;
    protected string $modelClass = UserRank::class;
    protected array $searchFields = ['rank_name'];
}
