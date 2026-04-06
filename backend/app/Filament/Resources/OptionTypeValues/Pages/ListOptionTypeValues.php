<?php

namespace App\Filament\Resources\OptionTypeValues\Pages;

use App\Filament\Resources\OptionTypeValues\OptionTypeValueResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOptionTypeValues extends ListRecords
{
    protected static string $resource = OptionTypeValueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
