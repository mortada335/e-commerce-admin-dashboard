<?php

namespace App\Filament\Resources\OrderTaskHistories;

use App\Filament\Resources\OrderTaskHistories\Pages\CreateOrderTaskHistory;
use App\Filament\Resources\OrderTaskHistories\Pages\EditOrderTaskHistory;
use App\Filament\Resources\OrderTaskHistories\Pages\ListOrderTaskHistories;
use App\Filament\Resources\OrderTaskHistories\Schemas\OrderTaskHistoryForm;
use App\Filament\Resources\OrderTaskHistories\Tables\OrderTaskHistoriesTable;
use App\Models\OrderTaskHistory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OrderTaskHistoryResource extends Resource
{
    protected static ?string $model = OrderTaskHistory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return OrderTaskHistoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OrderTaskHistoriesTable::configure($table);
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
            'index' => ListOrderTaskHistories::route('/'),
            'create' => CreateOrderTaskHistory::route('/create'),
            'edit' => EditOrderTaskHistory::route('/{record}/edit'),
        ];
    }
}
