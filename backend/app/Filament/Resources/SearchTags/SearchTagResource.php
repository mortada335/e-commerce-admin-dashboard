<?php

namespace App\Filament\Resources\SearchTags;

use App\Filament\Resources\SearchTags\Pages\CreateSearchTag;
use App\Filament\Resources\SearchTags\Pages\EditSearchTag;
use App\Filament\Resources\SearchTags\Pages\ListSearchTags;
use App\Filament\Resources\SearchTags\Schemas\SearchTagForm;
use App\Filament\Resources\SearchTags\Tables\SearchTagsTable;
use App\Models\SearchTag;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SearchTagResource extends Resource
{
    protected static ?string $model = SearchTag::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SearchTagForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SearchTagsTable::configure($table);
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
            'index' => ListSearchTags::route('/'),
            'create' => CreateSearchTag::route('/create'),
            'edit' => EditSearchTag::route('/{record}/edit'),
        ];
    }
}
