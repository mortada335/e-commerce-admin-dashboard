<?php

namespace App\Filament\Resources\SearchTags\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SearchTagForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('tag')
                    ->required(),
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
