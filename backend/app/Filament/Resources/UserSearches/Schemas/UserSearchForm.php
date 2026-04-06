<?php

namespace App\Filament\Resources\UserSearches\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserSearchForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('search_param')
                    ->required(),
                DateTimePicker::make('last_searched')
                    ->required(),
            ]);
    }
}
