<?php

namespace App\Filament\Resources\CustomerMemberships\Pages;

use App\Filament\Resources\CustomerMemberships\CustomerMembershipResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCustomerMembership extends EditRecord
{
    protected static string $resource = CustomerMembershipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
