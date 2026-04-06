<?php

namespace App\Filament\Resources\OrderPointsHistories;

use App\Filament\Resources\OrderPointsHistories\Pages\CreateOrderPointsHistory;
use App\Filament\Resources\OrderPointsHistories\Pages\EditOrderPointsHistory;
use App\Filament\Resources\OrderPointsHistories\Pages\ListOrderPointsHistories;
use App\Filament\Resources\OrderPointsHistories\Schemas\OrderPointsHistoryForm;
use App\Filament\Resources\OrderPointsHistories\Tables\OrderPointsHistoriesTable;
use App\Models\OrderPointsHistory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OrderPointsHistoryResource extends Resource
{
    protected static ?string $model = OrderPointsHistory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return OrderPointsHistoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OrderPointsHistoriesTable::configure($table);
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
            'index' => ListOrderPointsHistories::route('/'),
            'create' => CreateOrderPointsHistory::route('/create'),
            'edit' => EditOrderPointsHistory::route('/{record}/edit'),
        ];
    }
}
