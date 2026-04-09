<?php

namespace App\Filament\Resources\UserRanks\Pages;

use App\Filament\Resources\UserRanks\UserRankResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserRanks extends ListRecords
{
    protected static string $resource = UserRankResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
