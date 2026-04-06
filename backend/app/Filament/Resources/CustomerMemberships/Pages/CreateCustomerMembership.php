<?php

namespace App\Filament\Resources\CustomerMemberships\Pages;

use App\Filament\Resources\CustomerMemberships\CustomerMembershipResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCustomerMembership extends CreateRecord
{
    protected static string $resource = CustomerMembershipResource::class;
}
