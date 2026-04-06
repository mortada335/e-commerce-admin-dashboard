<?php

namespace App\Filament\Resources\OrderPointsHistories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderPointsHistoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_id')
                    ->required()
                    ->numeric(),
                TextInput::make('customer_id')
                    ->required()
                    ->numeric(),
                TextInput::make('points')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('description'),
            ]);
    }
}
