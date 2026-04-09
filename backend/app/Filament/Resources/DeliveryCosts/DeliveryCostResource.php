<?php

namespace App\Filament\Resources\DeliveryCosts;

use App\Filament\Resources\DeliveryCosts\Pages\CreateDeliveryCost;
use App\Filament\Resources\DeliveryCosts\Pages\EditDeliveryCost;
use App\Filament\Resources\DeliveryCosts\Pages\ListDeliveryCosts;
use App\Filament\Resources\DeliveryCosts\Schemas\DeliveryCostForm;
use App\Filament\Resources\DeliveryCosts\Tables\DeliveryCostsTable;
use App\Models\DeliveryCost;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DeliveryCostResource extends Resource
{
    protected static ?string $model = DeliveryCost::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return DeliveryCostForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DeliveryCostsTable::configure($table);
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
            'index' => ListDeliveryCosts::route('/'),
            'create' => CreateDeliveryCost::route('/create'),
            'edit' => EditDeliveryCost::route('/{record}/edit'),
        ];
    }
}
