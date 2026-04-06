<?php

namespace App\Filament\Resources\ShortVideos;

use App\Filament\Resources\ShortVideos\Pages\CreateShortVideo;
use App\Filament\Resources\ShortVideos\Pages\EditShortVideo;
use App\Filament\Resources\ShortVideos\Pages\ListShortVideos;
use App\Filament\Resources\ShortVideos\Schemas\ShortVideoForm;
use App\Filament\Resources\ShortVideos\Tables\ShortVideosTable;
use App\Models\ShortVideo;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ShortVideoResource extends Resource
{
    protected static ?string $model = ShortVideo::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ShortVideoForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ShortVideosTable::configure($table);
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
            'index' => ListShortVideos::route('/'),
            'create' => CreateShortVideo::route('/create'),
            'edit' => EditShortVideo::route('/{record}/edit'),
        ];
    }
}
