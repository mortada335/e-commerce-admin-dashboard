<?php

namespace App\Filament\Resources\AppIcons\Pages;

use App\Filament\Resources\AppIcons\AppIconResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAppIcons extends ListRecords
{
    protected static string $resource = AppIconResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
