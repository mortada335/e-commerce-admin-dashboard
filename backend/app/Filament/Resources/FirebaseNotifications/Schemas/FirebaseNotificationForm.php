<?php

namespace App\Filament\Resources\FirebaseNotifications\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class FirebaseNotificationForm
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
                TextInput::make('topic'),
                TextInput::make('target_users'),
                TextInput::make('status')
                    ->required()
                    ->numeric()
                    ->default(0),
                DateTimePicker::make('sent_at'),
                TextInput::make('created_by')
                    ->numeric(),
            ]);
    }
}
