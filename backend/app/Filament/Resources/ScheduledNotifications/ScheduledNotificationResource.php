<?php

namespace App\Filament\Resources\ScheduledNotifications;

use App\Filament\Resources\ScheduledNotifications\Pages\CreateScheduledNotification;
use App\Filament\Resources\ScheduledNotifications\Pages\EditScheduledNotification;
use App\Filament\Resources\ScheduledNotifications\Pages\ListScheduledNotifications;
use App\Filament\Resources\ScheduledNotifications\Schemas\ScheduledNotificationForm;
use App\Filament\Resources\ScheduledNotifications\Tables\ScheduledNotificationsTable;
use App\Models\ScheduledNotification;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ScheduledNotificationResource extends Resource
{
    protected static ?string $model = ScheduledNotification::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ScheduledNotificationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScheduledNotificationsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListScheduledNotifications::route('/'),
            'create' => CreateScheduledNotification::route('/create'),
            'edit' => EditScheduledNotification::route('/{record}/edit'),
        ];
    }
}
