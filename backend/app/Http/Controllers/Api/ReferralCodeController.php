<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ReferralCode;
use App\Traits\AdminCrud;

class ReferralCodeController extends Controller
{
    use AdminCrud;
    protected string $modelClass = ReferralCode::class;
    protected array $searchFields = ['code'];
    protected array $filterFields = ['user_id', 'status'];
}
