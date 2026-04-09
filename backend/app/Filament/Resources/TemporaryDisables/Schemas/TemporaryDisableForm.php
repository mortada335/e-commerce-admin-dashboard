<?php

namespace App\Filament\Resources\TemporaryDisables\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TemporaryDisableForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('reason'),
                TextInput::make('product_ids'),
                TextInput::make('category_ids'),
                DateTimePicker::make('disable_from'),
                DateTimePicker::make('disable_until'),
                Toggle::make('is_cancelled')
                    ->required(),
                TextInput::make('created_by')
                    ->numeric(),
            ]);
    }
}
