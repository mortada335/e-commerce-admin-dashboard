<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Review Details')->schema([
                    Select::make('product_id')
                        ->relationship('product', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),
                    Select::make('customer_id')
                        ->relationship('customer', 'email')
                        ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name} ({$record->email})")
                        ->searchable()
                        ->preload()
                        ->required(),
                    Select::make('rating')
                        ->options([
                            1 => '1 Star',
                            2 => '2 Stars',
                            3 => '3 Stars',
                            4 => '4 Stars',
                            5 => '5 Stars',
                        ])
                        ->required()
                        ->default(5),
                    Toggle::make('is_approved')
                        ->label('Approved')
                        ->default(false)
                        ->required(),
                    Textarea::make('comment')
                        ->columnSpanFull(),
                ])->columns(2),
            ]);
    }
}
