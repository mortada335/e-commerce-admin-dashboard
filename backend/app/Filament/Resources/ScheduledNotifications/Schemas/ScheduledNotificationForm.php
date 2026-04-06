<?php

namespace App\Filament\Resources\ScheduledNotifications\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ScheduledNotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('title_ar'),
                Textarea::make('body')
                    ->columnSpanFull(),
                Textarea::make('body_ar')
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('link'),
                DateTimePicker::make('scheduled_at'),
                Toggle::make('is_approved')
                    ->required(),
                TextInput::make('approved_by')
                    ->numeric(),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('target'),
                TextInput::make('created_by')
                    ->numeric(),
            ]);
    }
}
