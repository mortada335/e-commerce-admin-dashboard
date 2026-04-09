<?php

namespace App\Filament\Resources\ReferralCodes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ReferralCodeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->numeric(),
                TextInput::make('code')
                    ->required(),
                TextInput::make('uses_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('max_uses')
                    ->numeric(),
                TextInput::make('reward_amount')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
