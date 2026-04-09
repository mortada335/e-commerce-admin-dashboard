<?php

namespace App\Filament\Resources\ImportantNotes;

use App\Filament\Resources\ImportantNotes\Pages\CreateImportantNote;
use App\Filament\Resources\ImportantNotes\Pages\EditImportantNote;
use App\Filament\Resources\ImportantNotes\Pages\ListImportantNotes;
use App\Filament\Resources\ImportantNotes\Schemas\ImportantNoteForm;
use App\Filament\Resources\ImportantNotes\Tables\ImportantNotesTable;
use App\Models\ImportantNote;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ImportantNoteResource extends Resource
{
    protected static ?string $model = ImportantNote::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ImportantNoteForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ImportantNotesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListImportantNotes::route('/'),
            'create' => CreateImportantNote::route('/create'),
            'edit' => EditImportantNote::route('/{record}/edit'),
        ];
    }
}
