<?php

namespace App\Filament\Resources\CouponHistories;

use App\Filament\Resources\CouponHistories\Pages\CreateCouponHistory;
use App\Filament\Resources\CouponHistories\Pages\EditCouponHistory;
use App\Filament\Resources\CouponHistories\Pages\ListCouponHistories;
use App\Filament\Resources\CouponHistories\Schemas\CouponHistoryForm;
use App\Filament\Resources\CouponHistories\Tables\CouponHistoriesTable;
use App\Models\CouponHistory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CouponHistoryResource extends Resource
{
    protected static ?string $model = CouponHistory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return CouponHistoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CouponHistoriesTable::configure($table);
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
            'index' => ListCouponHistories::route('/'),
            'create' => CreateCouponHistory::route('/create'),
            'edit' => EditCouponHistory::route('/{record}/edit'),
        ];
    }
}
