<?php

namespace App\Filament\Resources\UserCarts\Pages;

use App\Filament\Resources\UserCarts\UserCartResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserCarts extends ListRecords
{
    protected static string $resource = UserCartResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
