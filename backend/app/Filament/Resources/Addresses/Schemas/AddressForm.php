<?php

namespace App\Filament\Resources\Addresses\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AddressForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('customer_id')
                    ->relationship('customer', 'id'),
                TextInput::make('firstname')
                    ->required()
                    ->default(''),
                TextInput::make('lastname')
                    ->required()
                    ->default(''),
                TextInput::make('company'),
                Textarea::make('address_1')
                    ->required()
                    ->default('')
                    ->columnSpanFull(),
                Textarea::make('address_2')
                    ->columnSpanFull(),
                TextInput::make('city')
                    ->required()
                    ->default(''),
                TextInput::make('postcode')
                    ->required()
                    ->default(''),
                TextInput::make('country_id')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('zone_id')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('custom_field'),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('address_type'),
                TextInput::make('latitude')
                    ->numeric(),
                TextInput::make('longitude')
                    ->numeric(),
            ]);
    }
}
