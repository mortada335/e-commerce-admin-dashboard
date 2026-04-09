<?php

namespace App\Filament\Resources\CurrencyExchanges\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CurrencyExchangeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('currency_from')
                    ->required()
                    ->default('USD'),
                TextInput::make('currency_to')
                    ->required()
                    ->default('IQD'),
                TextInput::make('rate')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
