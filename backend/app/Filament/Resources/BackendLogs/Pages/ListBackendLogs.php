<?php

namespace App\Filament\Resources\BackendLogs\Pages;

use App\Filament\Resources\BackendLogs\BackendLogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBackendLogs extends ListRecords
{
    protected static string $resource = BackendLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
