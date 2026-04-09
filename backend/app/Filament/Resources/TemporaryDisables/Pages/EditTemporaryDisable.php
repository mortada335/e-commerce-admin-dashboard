<?php

namespace App\Filament\Resources\TemporaryDisables\Pages;

use App\Filament\Resources\TemporaryDisables\TemporaryDisableResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTemporaryDisable extends EditRecord
{
    protected static string $resource = TemporaryDisableResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
