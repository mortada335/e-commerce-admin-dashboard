<?php

namespace App\Filament\Resources\Popups\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PopupForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('type')
                    ->required()
                    ->default('image'),
                Textarea::make('content')
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('link'),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                DateTimePicker::make('start_date'),
                DateTimePicker::make('end_date'),
                TextInput::make('display_frequency')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('target_pages'),
            ]);
    }
}
