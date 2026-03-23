<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name'),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Textarea::make('short_description')
                    ->columnSpanFull(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('discount_price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                TextInput::make('stock_quantity')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('low_stock_threshold')
                    ->required()
                    ->numeric()
                    ->default(10),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
                Toggle::make('is_featured')
                    ->required(),
                TextInput::make('weight')
                    ->numeric(),
                TextInput::make('meta'),
            ]);
    }
}
