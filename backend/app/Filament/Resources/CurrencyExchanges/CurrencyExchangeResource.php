<?php

namespace App\Filament\Resources\CurrencyExchanges;

use App\Filament\Resources\CurrencyExchanges\Pages\CreateCurrencyExchange;
use App\Filament\Resources\CurrencyExchanges\Pages\EditCurrencyExchange;
use App\Filament\Resources\CurrencyExchanges\Pages\ListCurrencyExchanges;
use App\Filament\Resources\CurrencyExchanges\Schemas\CurrencyExchangeForm;
use App\Filament\Resources\CurrencyExchanges\Tables\CurrencyExchangesTable;
use App\Models\CurrencyExchange;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CurrencyExchangeResource extends Resource
{
    protected static ?string $model = CurrencyExchange::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return CurrencyExchangeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CurrencyExchangesTable::configure($table);
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
            'index' => ListCurrencyExchanges::route('/'),
            'create' => CreateCurrencyExchange::route('/create'),
            'edit' => EditCurrencyExchange::route('/{record}/edit'),
        ];
    }
}
