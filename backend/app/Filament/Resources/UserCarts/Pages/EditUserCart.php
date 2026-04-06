<?php

namespace App\Filament\Resources\UserCarts\Pages;

use App\Filament\Resources\UserCarts\UserCartResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUserCart extends EditRecord
{
    protected static string $resource = UserCartResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
