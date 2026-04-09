<?php

namespace App\Filament\Resources\OptionTypes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OptionTypeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('type')
                    ->required(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
