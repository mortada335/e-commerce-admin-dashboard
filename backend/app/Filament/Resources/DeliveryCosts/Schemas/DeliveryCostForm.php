<?php

namespace App\Filament\Resources\DeliveryCosts\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DeliveryCostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('city')
                    ->required(),
                TextInput::make('zone')
                    ->required()
                    ->default('others'),
                TextInput::make('cost')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                TextInput::make('free_delivery_threshold')
                    ->numeric(),
                TextInput::make('estimated_days')
                    ->required()
                    ->numeric()
                    ->default(3),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
