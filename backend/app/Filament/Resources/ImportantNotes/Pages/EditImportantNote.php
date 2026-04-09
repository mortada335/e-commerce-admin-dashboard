<?php

namespace App\Filament\Resources\ImportantNotes\Pages;

use App\Filament\Resources\ImportantNotes\ImportantNoteResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditImportantNote extends EditRecord
{
    protected static string $resource = ImportantNoteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
