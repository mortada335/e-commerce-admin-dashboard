<?php

namespace App\Filament\Resources\OptionTypeValues\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OptionTypeValueForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('option_type_id')
                    ->relationship('optionType', 'id')
                    ->required(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
