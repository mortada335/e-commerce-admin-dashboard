<?php

namespace App\Filament\Resources\HomeSections\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class HomeSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title'),
                TextInput::make('title_ar'),
                TextInput::make('section_type')
                    ->required(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('config'),
                TextInput::make('items'),
                TextInput::make('background_color'),
                TextInput::make('style')
                    ->required()
                    ->default('default'),
            ]);
    }
}
