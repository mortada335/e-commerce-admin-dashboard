<?php

namespace App\Filament\Resources\UserRanks\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserRankForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('rank_name')
                    ->required(),
                TextInput::make('min_points')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('max_points')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
