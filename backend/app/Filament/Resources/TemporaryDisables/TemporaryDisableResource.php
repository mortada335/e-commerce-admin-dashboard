<?php

namespace App\Filament\Resources\TemporaryDisables;

use App\Filament\Resources\TemporaryDisables\Pages\CreateTemporaryDisable;
use App\Filament\Resources\TemporaryDisables\Pages\EditTemporaryDisable;
use App\Filament\Resources\TemporaryDisables\Pages\ListTemporaryDisables;
use App\Filament\Resources\TemporaryDisables\Schemas\TemporaryDisableForm;
use App\Filament\Resources\TemporaryDisables\Tables\TemporaryDisablesTable;
use App\Models\TemporaryDisable;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TemporaryDisableResource extends Resource
{
    protected static ?string $model = TemporaryDisable::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return TemporaryDisableForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TemporaryDisablesTable::configure($table);
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
            'index' => ListTemporaryDisables::route('/'),
            'create' => CreateTemporaryDisable::route('/create'),
            'edit' => EditTemporaryDisable::route('/{record}/edit'),
        ];
    }
}
