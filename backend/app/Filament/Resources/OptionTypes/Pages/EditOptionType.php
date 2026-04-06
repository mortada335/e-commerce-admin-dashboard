<?php

namespace App\Filament\Resources\OptionTypes\Pages;

use App\Filament\Resources\OptionTypes\OptionTypeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOptionType extends EditRecord
{
    protected static string $resource = OptionTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
