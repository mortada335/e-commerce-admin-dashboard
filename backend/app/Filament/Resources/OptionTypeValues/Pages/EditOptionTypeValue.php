<?php

namespace App\Filament\Resources\OptionTypeValues\Pages;

use App\Filament\Resources\OptionTypeValues\OptionTypeValueResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOptionTypeValue extends EditRecord
{
    protected static string $resource = OptionTypeValueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
