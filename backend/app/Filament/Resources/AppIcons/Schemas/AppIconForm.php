<?php

namespace App\Filament\Resources\AppIcons\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AppIconForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('icon_url')
                    ->url()
                    ->required(),
                TextInput::make('link'),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
