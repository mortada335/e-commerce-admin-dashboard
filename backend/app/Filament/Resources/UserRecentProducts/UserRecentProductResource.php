<?php

namespace App\Filament\Resources\UserRecentProducts;

use App\Filament\Resources\UserRecentProducts\Pages\CreateUserRecentProduct;
use App\Filament\Resources\UserRecentProducts\Pages\EditUserRecentProduct;
use App\Filament\Resources\UserRecentProducts\Pages\ListUserRecentProducts;
use App\Filament\Resources\UserRecentProducts\Schemas\UserRecentProductForm;
use App\Filament\Resources\UserRecentProducts\Tables\UserRecentProductsTable;
use App\Models\UserRecentProduct;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserRecentProductResource extends Resource
{
    protected static ?string $model = UserRecentProduct::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return UserRecentProductForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserRecentProductsTable::configure($table);
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
            'index' => ListUserRecentProducts::route('/'),
            'create' => CreateUserRecentProduct::route('/create'),
            'edit' => EditUserRecentProduct::route('/{record}/edit'),
        ];
    }
}
