<?php

namespace App\Filament\Resources\ImportantNotes\Pages;

use App\Filament\Resources\ImportantNotes\ImportantNoteResource;
use Filament\Resources\Pages\CreateRecord;

class CreateImportantNote extends CreateRecord
{
    protected static string $resource = ImportantNoteResource::class;
}
