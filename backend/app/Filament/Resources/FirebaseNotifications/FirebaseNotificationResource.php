<?php

namespace App\Filament\Resources\FirebaseNotifications;

use App\Filament\Resources\FirebaseNotifications\Pages\CreateFirebaseNotification;
use App\Filament\Resources\FirebaseNotifications\Pages\EditFirebaseNotification;
use App\Filament\Resources\FirebaseNotifications\Pages\ListFirebaseNotifications;
use App\Filament\Resources\FirebaseNotifications\Schemas\FirebaseNotificationForm;
use App\Filament\Resources\FirebaseNotifications\Tables\FirebaseNotificationsTable;
use App\Models\FirebaseNotification;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FirebaseNotificationResource extends Resource
{
    protected static ?string $model = FirebaseNotification::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return FirebaseNotificationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FirebaseNotificationsTable::configure($table);
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
            'index' => ListFirebaseNotifications::route('/'),
            'create' => CreateFirebaseNotification::route('/create'),
            'edit' => EditFirebaseNotification::route('/{record}/edit'),
        ];
    }
}
