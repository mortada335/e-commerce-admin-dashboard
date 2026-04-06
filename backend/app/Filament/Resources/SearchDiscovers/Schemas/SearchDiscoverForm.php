<?php

namespace App\Filament\Resources\SearchDiscovers\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SearchDiscoverForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('keyword')
                    ->required(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('link'),
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
