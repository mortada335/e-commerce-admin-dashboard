<?php

namespace App\Filament\Resources\Customers\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('first_name')
                    ->required(),
                TextInput::make('last_name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('avatar'),
                DatePicker::make('date_of_birth'),
                TextInput::make('gender'),
                Toggle::make('is_active')
                    ->required(),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('address_line1'),
                TextInput::make('address_line2'),
                TextInput::make('city'),
                TextInput::make('state'),
                TextInput::make('country')
                    ->default('US'),
                TextInput::make('zip'),
            ]);
    }
}
