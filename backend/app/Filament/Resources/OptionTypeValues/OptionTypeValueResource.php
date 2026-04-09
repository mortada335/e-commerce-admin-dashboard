<?php

namespace App\Filament\Resources\OptionTypeValues;

use App\Filament\Resources\OptionTypeValues\Pages\CreateOptionTypeValue;
use App\Filament\Resources\OptionTypeValues\Pages\EditOptionTypeValue;
use App\Filament\Resources\OptionTypeValues\Pages\ListOptionTypeValues;
use App\Filament\Resources\OptionTypeValues\Schemas\OptionTypeValueForm;
use App\Filament\Resources\OptionTypeValues\Tables\OptionTypeValuesTable;
use App\Models\OptionTypeValue;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OptionTypeValueResource extends Resource
{
    protected static ?string $model = OptionTypeValue::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return OptionTypeValueForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OptionTypeValuesTable::configure($table);
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
            'index' => ListOptionTypeValues::route('/'),
            'create' => CreateOptionTypeValue::route('/create'),
            'edit' => EditOptionTypeValue::route('/{record}/edit'),
        ];
    }
}
