<?php

namespace App\Filament\Resources\ProductVideos;

use App\Filament\Resources\ProductVideos\Pages\CreateProductVideo;
use App\Filament\Resources\ProductVideos\Pages\EditProductVideo;
use App\Filament\Resources\ProductVideos\Pages\ListProductVideos;
use App\Filament\Resources\ProductVideos\Schemas\ProductVideoForm;
use App\Filament\Resources\ProductVideos\Tables\ProductVideosTable;
use App\Models\ProductVideo;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ProductVideoResource extends Resource
{
    protected static ?string $model = ProductVideo::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ProductVideoForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProductVideosTable::configure($table);
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
            'index' => ListProductVideos::route('/'),
            'create' => CreateProductVideo::route('/create'),
            'edit' => EditProductVideo::route('/{record}/edit'),
        ];
    }
}
