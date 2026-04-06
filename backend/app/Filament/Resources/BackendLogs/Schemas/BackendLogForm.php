<?php

namespace App\Filament\Resources\BackendLogs\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BackendLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('level')
                    ->required()
                    ->default('info'),
                Textarea::make('message')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('context'),
                TextInput::make('channel'),
            ]);
    }
}
