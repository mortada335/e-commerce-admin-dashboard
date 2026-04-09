<?php

namespace App\Filament\Resources\AppIcons;

use App\Filament\Resources\AppIcons\Pages\CreateAppIcon;
use App\Filament\Resources\AppIcons\Pages\EditAppIcon;
use App\Filament\Resources\AppIcons\Pages\ListAppIcons;
use App\Filament\Resources\AppIcons\Schemas\AppIconForm;
use App\Filament\Resources\AppIcons\Tables\AppIconsTable;
use App\Models\AppIcon;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AppIconResource extends Resource
{
    protected static ?string $model = AppIcon::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return AppIconForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AppIconsTable::configure($table);
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
            'index' => ListAppIcons::route('/'),
            'create' => CreateAppIcon::route('/create'),
            'edit' => EditAppIcon::route('/{record}/edit'),
        ];
    }
}
