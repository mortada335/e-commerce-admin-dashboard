<?php

namespace App\Filament\Resources\UserSearches\Pages;

use App\Filament\Resources\UserSearches\UserSearchResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserSearches extends ListRecords
{
    protected static string $resource = UserSearchResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
