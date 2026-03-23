<?php

namespace App\Filament\Resources\Customers;

use App\Filament\Resources\Customers\Pages\CreateCustomer;
use App\Filament\Resources\Customers\Pages\EditCustomer;
use App\Filament\Resources\Customers\Pages\ListCustomers;
use App\Models\Customer;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class CustomerResource extends Resource
{
    protected static ?string $model = Customer::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|\UnitEnum|null $navigationGroup = 'Customers';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('Customer Info')->schema([
                \Filament\Forms\Components\TextInput::make('first_name')->required()->maxLength(255),
                \Filament\Forms\Components\TextInput::make('last_name')->required()->maxLength(255),
                \Filament\Forms\Components\TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
                \Filament\Forms\Components\TextInput::make('phone')->tel()->maxLength(20),
            ])->columns(2),

            \Filament\Schemas\Components\Section::make('Address Details')->schema([
                \Filament\Forms\Components\TextInput::make('address.street')->label('Street'),
                \Filament\Forms\Components\TextInput::make('address.city')->label('City'),
                \Filament\Forms\Components\TextInput::make('address.state')->label('State/Province'),
                \Filament\Forms\Components\TextInput::make('address.zip')->label('ZIP Code'),
                \Filament\Forms\Components\TextInput::make('address.country')->label('Country')->default('US'),
            ])->columns(2),

            \Filament\Schemas\Components\Section::make('Status')->schema([
                \Filament\Forms\Components\Toggle::make('is_active')
                    ->label('Active Customer')->default(true),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->label('')
                    ->circular()
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name=' . urlencode($record->first_name . ' ' . $record->last_name) . '&color=7F9CF5&background=EBF4FF'),
                Tables\Columns\TextColumn::make('full_name')
                    ->searchable(['first_name', 'last_name'])->sortable(['first_name'])->weight('bold'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()->copyable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('orders_count')
                    ->counts('orders')->label('Orders'),
                Tables\Columns\TextColumn::make('total_spent')
                    ->money('USD')->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()->label('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()->sortable()->since(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListCustomers::route('/'),
            'create' => CreateCustomer::route('/create'),
            'edit'   => EditCustomer::route('/{record}/edit'),
        ];
    }
}
