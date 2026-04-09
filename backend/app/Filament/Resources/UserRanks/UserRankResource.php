<?php

namespace App\Filament\Resources\UserRanks;

use App\Filament\Resources\UserRanks\Pages\CreateUserRank;
use App\Filament\Resources\UserRanks\Pages\EditUserRank;
use App\Filament\Resources\UserRanks\Pages\ListUserRanks;
use App\Filament\Resources\UserRanks\Schemas\UserRankForm;
use App\Filament\Resources\UserRanks\Tables\UserRanksTable;
use App\Models\UserRank;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserRankResource extends Resource
{
    protected static ?string $model = UserRank::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return UserRankForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserRanksTable::configure($table);
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
            'index' => ListUserRanks::route('/'),
            'create' => CreateUserRank::route('/create'),
            'edit' => EditUserRank::route('/{record}/edit'),
        ];
    }
}
