<?php

namespace App\Filament\Resources\BackendLogs\Pages;

use App\Filament\Resources\BackendLogs\BackendLogResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBackendLog extends EditRecord
{
    protected static string $resource = BackendLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
