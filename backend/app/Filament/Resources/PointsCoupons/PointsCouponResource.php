<?php

namespace App\Filament\Resources\PointsCoupons;

use App\Filament\Resources\PointsCoupons\Pages\CreatePointsCoupon;
use App\Filament\Resources\PointsCoupons\Pages\EditPointsCoupon;
use App\Filament\Resources\PointsCoupons\Pages\ListPointsCoupons;
use App\Filament\Resources\PointsCoupons\Schemas\PointsCouponForm;
use App\Filament\Resources\PointsCoupons\Tables\PointsCouponsTable;
use App\Models\PointsCoupon;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PointsCouponResource extends Resource
{
    protected static ?string $model = PointsCoupon::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PointsCouponForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PointsCouponsTable::configure($table);
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
            'index' => ListPointsCoupons::route('/'),
            'create' => CreatePointsCoupon::route('/create'),
            'edit' => EditPointsCoupon::route('/{record}/edit'),
        ];
    }
}
