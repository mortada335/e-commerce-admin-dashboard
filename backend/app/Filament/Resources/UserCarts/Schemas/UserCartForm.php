<?php

namespace App\Filament\Resources\UserCarts\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserCartForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('customer_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('options'),
            ]);
    }
}
