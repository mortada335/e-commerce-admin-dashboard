<?php

namespace App\Filament\Resources\CustomerMemberships\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CustomerMembershipForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('customer_id')
                    ->required()
                    ->numeric(),
                TextInput::make('membership_type')
                    ->required()
                    ->default('standard'),
                TextInput::make('points')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('total_spent')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('total_orders')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
                DateTimePicker::make('member_since'),
                DateTimePicker::make('expires_at'),
                TextInput::make('benefits'),
            ]);
    }
}
