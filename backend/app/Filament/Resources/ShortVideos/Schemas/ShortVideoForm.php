<?php

namespace App\Filament\Resources\ShortVideos\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ShortVideoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title'),
                TextInput::make('video_url')
                    ->url()
                    ->required(),
                TextInput::make('thumbnail'),
                TextInput::make('product_id')
                    ->numeric(),
                TextInput::make('sort_order')
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
