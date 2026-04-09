<?php

namespace App\Filament\Resources\UserSearches;

use App\Filament\Resources\UserSearches\Pages\CreateUserSearch;
use App\Filament\Resources\UserSearches\Pages\EditUserSearch;
use App\Filament\Resources\UserSearches\Pages\ListUserSearches;
use App\Filament\Resources\UserSearches\Schemas\UserSearchForm;
use App\Filament\Resources\UserSearches\Tables\UserSearchesTable;
use App\Models\UserSearch;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserSearchResource extends Resource
{
    protected static ?string $model = UserSearch::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return UserSearchForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserSearchesTable::configure($table);
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
            'index' => ListUserSearches::route('/'),
            'create' => CreateUserSearch::route('/create'),
            'edit' => EditUserSearch::route('/{record}/edit'),
        ];
    }
}
