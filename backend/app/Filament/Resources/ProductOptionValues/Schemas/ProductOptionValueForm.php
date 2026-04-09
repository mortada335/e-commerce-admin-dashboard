<?php

namespace App\Filament\Resources\ProductOptionValues\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductOptionValueForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('product_id')
                    ->relationship('product', 'name')
                    ->required(),
                Select::make('option_type_id')
                    ->relationship('optionType', 'id')
                    ->required(),
                Select::make('option_type_value_id')
                    ->relationship('optionTypeValue', 'id')
                    ->required(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('subtract')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                TextInput::make('price_prefix')
                    ->required()
                    ->default('+'),
                TextInput::make('weight')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('weight_prefix')
                    ->required()
                    ->default('+'),
            ]);
    }
}
