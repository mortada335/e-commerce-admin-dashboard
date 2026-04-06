<?php

namespace App\Filament\Resources\PointsCoupons\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PointsCouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('code')
                    ->required(),
                TextInput::make('points_required')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('discount')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('type')
                    ->required()
                    ->default('P'),
                TextInput::make('uses_total')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('uses_customer')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
                DateTimePicker::make('date_start'),
                DateTimePicker::make('date_end'),
            ]);
    }
}
