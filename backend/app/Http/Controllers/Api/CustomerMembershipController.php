<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\CustomerMembership;
use App\Traits\AdminCrud;

class CustomerMembershipController extends Controller
{
    use AdminCrud;
    protected string $modelClass = CustomerMembership::class;
    protected array $filterFields = ['customer_id', 'membership_type', 'status'];
}
