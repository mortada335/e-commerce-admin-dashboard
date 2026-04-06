<?php

namespace App\Filament\Resources\OptionTypes;

use App\Filament\Resources\OptionTypes\Pages\CreateOptionType;
use App\Filament\Resources\OptionTypes\Pages\EditOptionType;
use App\Filament\Resources\OptionTypes\Pages\ListOptionTypes;
use App\Filament\Resources\OptionTypes\Schemas\OptionTypeForm;
use App\Filament\Resources\OptionTypes\Tables\OptionTypesTable;
use App\Models\OptionType;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OptionTypeResource extends Resource
{
    protected static ?string $model = OptionType::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return OptionTypeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OptionTypesTable::configure($table);
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
            'index' => ListOptionTypes::route('/'),
            'create' => CreateOptionType::route('/create'),
            'edit' => EditOptionType::route('/{record}/edit'),
        ];
    }
}
