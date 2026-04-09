<?php

namespace App\Filament\Resources\OrderTaskHistories\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderTaskHistoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('order_id')
                    ->relationship('order', 'id')
                    ->required(),
                TextInput::make('task_id'),
                TextInput::make('task_name'),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('result'),
            ]);
    }
}
