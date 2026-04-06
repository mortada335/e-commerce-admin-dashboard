<?php

namespace App\Filament\Resources\SearchFilters\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SearchFilterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('filter_type')
                    ->required(),
                TextInput::make('config'),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('language_id')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
