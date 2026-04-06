<?php

namespace App\Filament\Resources\SearchFilters;

use App\Filament\Resources\SearchFilters\Pages\CreateSearchFilter;
use App\Filament\Resources\SearchFilters\Pages\EditSearchFilter;
use App\Filament\Resources\SearchFilters\Pages\ListSearchFilters;
use App\Filament\Resources\SearchFilters\Schemas\SearchFilterForm;
use App\Filament\Resources\SearchFilters\Tables\SearchFiltersTable;
use App\Models\SearchFilter;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SearchFilterResource extends Resource
{
    protected static ?string $model = SearchFilter::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SearchFilterForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SearchFiltersTable::configure($table);
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
            'index' => ListSearchFilters::route('/'),
            'create' => CreateSearchFilter::route('/create'),
            'edit' => EditSearchFilter::route('/{record}/edit'),
        ];
    }
}
