<?php

namespace App\Filament\Resources\BackendLogs;

use App\Filament\Resources\BackendLogs\Pages\CreateBackendLog;
use App\Filament\Resources\BackendLogs\Pages\EditBackendLog;
use App\Filament\Resources\BackendLogs\Pages\ListBackendLogs;
use App\Filament\Resources\BackendLogs\Schemas\BackendLogForm;
use App\Filament\Resources\BackendLogs\Tables\BackendLogsTable;
use App\Models\BackendLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BackendLogResource extends Resource
{
    protected static ?string $model = BackendLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return BackendLogForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BackendLogsTable::configure($table);
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
            'index' => ListBackendLogs::route('/'),
            'create' => CreateBackendLog::route('/create'),
            'edit' => EditBackendLog::route('/{record}/edit'),
        ];
    }
}
