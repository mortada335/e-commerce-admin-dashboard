<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Traits\AdminCrud;

class AddressAdminController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Address::class;
    protected array $filterFields = ['customer_id', 'city', 'country_id'];
    protected array $searchFields = ['firstname', 'lastname', 'city', 'address_1'];
}
