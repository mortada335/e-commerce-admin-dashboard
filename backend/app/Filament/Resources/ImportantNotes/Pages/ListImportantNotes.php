<?php

namespace App\Filament\Resources\ImportantNotes\Pages;

use App\Filament\Resources\ImportantNotes\ImportantNoteResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListImportantNotes extends ListRecords
{
    protected static string $resource = ImportantNoteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
