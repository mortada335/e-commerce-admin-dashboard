<?php

namespace App\Filament\Resources\AppIcons\Pages;

use App\Filament\Resources\AppIcons\AppIconResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAppIcon extends EditRecord
{
    protected static string $resource = AppIconResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
