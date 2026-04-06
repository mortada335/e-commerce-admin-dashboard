<?php

namespace App\Filament\Resources\UserCarts;

use App\Filament\Resources\UserCarts\Pages\CreateUserCart;
use App\Filament\Resources\UserCarts\Pages\EditUserCart;
use App\Filament\Resources\UserCarts\Pages\ListUserCarts;
use App\Filament\Resources\UserCarts\Schemas\UserCartForm;
use App\Filament\Resources\UserCarts\Tables\UserCartsTable;
use App\Models\UserCart;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserCartResource extends Resource
{
    protected static ?string $model = UserCart::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return UserCartForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserCartsTable::configure($table);
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
            'index' => ListUserCarts::route('/'),
            'create' => CreateUserCart::route('/create'),
            'edit' => EditUserCart::route('/{record}/edit'),
        ];
    }
}
