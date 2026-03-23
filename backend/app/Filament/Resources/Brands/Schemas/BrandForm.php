<?php

namespace App\Filament\Resources\Brands\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Illuminate\Support\Str;

class BrandForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Brand Information')->schema([
                    TextInput::make('name')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn (string $operation, $state, \Filament\Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null)
                        ->maxLength(255),
                    TextInput::make('slug')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(255),
                    FileUpload::make('logo')
                        ->image()
                        ->directory('brands')
                        ->columnSpanFull(),
                    Toggle::make('is_active')
                        ->default(true)
                        ->required(),
                ])->columns(2),
            ]);
    }
}
