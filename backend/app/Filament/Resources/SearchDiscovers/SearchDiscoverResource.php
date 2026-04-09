<?php

namespace App\Filament\Resources\SearchDiscovers;

use App\Filament\Resources\SearchDiscovers\Pages\CreateSearchDiscover;
use App\Filament\Resources\SearchDiscovers\Pages\EditSearchDiscover;
use App\Filament\Resources\SearchDiscovers\Pages\ListSearchDiscovers;
use App\Filament\Resources\SearchDiscovers\Schemas\SearchDiscoverForm;
use App\Filament\Resources\SearchDiscovers\Tables\SearchDiscoversTable;
use App\Models\SearchDiscover;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SearchDiscoverResource extends Resource
{
    protected static ?string $model = SearchDiscover::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SearchDiscoverForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SearchDiscoversTable::configure($table);
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
            'index' => ListSearchDiscovers::route('/'),
            'create' => CreateSearchDiscover::route('/create'),
            'edit' => EditSearchDiscover::route('/{record}/edit'),
        ];
    }
}
