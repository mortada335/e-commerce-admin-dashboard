<?php

namespace App\Filament\Resources\CouponHistories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CouponHistoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('coupon_id')
                    ->required()
                    ->numeric(),
                TextInput::make('order_id')
                    ->numeric(),
                TextInput::make('customer_id')
                    ->numeric(),
                TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
