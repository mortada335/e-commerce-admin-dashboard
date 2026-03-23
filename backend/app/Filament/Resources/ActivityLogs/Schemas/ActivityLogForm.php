<?php

namespace App\Filament\Resources\ActivityLogs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ActivityLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name'),
                TextInput::make('action')
                    ->required(),
                TextInput::make('model_type'),
                TextInput::make('model_id')
                    ->numeric(),
                TextInput::make('old_values'),
                TextInput::make('new_values'),
                TextInput::make('ip_address'),
                TextInput::make('user_agent'),
            ]);
    }
}
