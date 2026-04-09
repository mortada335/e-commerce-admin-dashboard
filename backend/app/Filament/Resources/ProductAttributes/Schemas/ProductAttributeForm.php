<?php

namespace App\Filament\Resources\ProductAttributes\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProductAttributeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('product_id')
                    ->relationship('product', 'name')
                    ->required(),
                Select::make('attribute_id')
                    ->relationship('attribute', 'name')
                    ->required(),
                TextInput::make('language_id')
                    ->required()
                    ->numeric()
                    ->default(1),
                Textarea::make('text')
                    ->columnSpanFull(),
            ]);
    }
}
