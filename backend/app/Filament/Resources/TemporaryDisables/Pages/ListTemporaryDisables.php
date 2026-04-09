<?php

namespace App\Filament\Resources\TemporaryDisables\Pages;

use App\Filament\Resources\TemporaryDisables\TemporaryDisableResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTemporaryDisables extends ListRecords
{
    protected static string $resource = TemporaryDisableResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
