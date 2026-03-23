<?php

namespace App\Filament\Resources\Coupons\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required(),
                TextInput::make('description'),
                TextInput::make('type')
                    ->required()
                    ->default('percentage'),
                TextInput::make('value')
                    ->required()
                    ->numeric(),
                TextInput::make('min_order_amount')
                    ->numeric(),
                TextInput::make('max_discount_amount')
                    ->numeric(),
                TextInput::make('max_uses')
                    ->numeric(),
                TextInput::make('used_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('max_uses_per_user')
                    ->numeric()
                    ->default(1),
                Toggle::make('is_active')
                    ->required(),
                DateTimePicker::make('starts_at'),
                DateTimePicker::make('expires_at'),
            ]);
    }
}
