<?php

namespace App\Filament\Resources\CustomerMemberships;

use App\Filament\Resources\CustomerMemberships\Pages\CreateCustomerMembership;
use App\Filament\Resources\CustomerMemberships\Pages\EditCustomerMembership;
use App\Filament\Resources\CustomerMemberships\Pages\ListCustomerMemberships;
use App\Filament\Resources\CustomerMemberships\Schemas\CustomerMembershipForm;
use App\Filament\Resources\CustomerMemberships\Tables\CustomerMembershipsTable;
use App\Models\CustomerMembership;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CustomerMembershipResource extends Resource
{
    protected static ?string $model = CustomerMembership::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return CustomerMembershipForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CustomerMembershipsTable::configure($table);
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
            'index' => ListCustomerMemberships::route('/'),
            'create' => CreateCustomerMembership::route('/create'),
            'edit' => EditCustomerMembership::route('/{record}/edit'),
        ];
    }
}
