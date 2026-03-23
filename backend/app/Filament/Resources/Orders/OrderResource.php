<?php

namespace App\Filament\Resources\Orders;

use App\Filament\Resources\Orders\Pages\CreateOrder;
use App\Filament\Resources\Orders\Pages\EditOrder;
use App\Filament\Resources\Orders\Pages\ListOrders;
use App\Models\Order;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingCart;

    protected static string|\UnitEnum|null $navigationGroup = 'Customers';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('Order Information')->schema([
                \Filament\Forms\Components\TextInput::make('order_number')
                    ->required()->maxLength(255)->unique(ignoreRecord: true)
                    ->disabled(fn (string $operation) => $operation === 'edit'),
                \Filament\Forms\Components\Select::make('customer_id')
                    ->relationship('customer', 'email')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->full_name} ({$record->email})")
                    ->searchable()->preload()->required(),
                \Filament\Forms\Components\Select::make('coupon_id')
                    ->relationship('coupon', 'code')->searchable()->preload(),
            ])->columns(3),

            \Filament\Schemas\Components\Section::make('Totals & Status')->schema([
                \Filament\Forms\Components\TextInput::make('subtotal')->numeric()->prefix('$')->required(),
                \Filament\Forms\Components\TextInput::make('discount_total')->numeric()->prefix('$')->default(0),
                \Filament\Forms\Components\TextInput::make('tax_total')->numeric()->prefix('$')->default(0),
                \Filament\Forms\Components\TextInput::make('shipping_total')->numeric()->prefix('$')->default(0),
                \Filament\Forms\Components\TextInput::make('total')->numeric()->prefix('$')->required(),
                \Filament\Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending', 'processing' => 'Processing',
                        'shipped' => 'Shipped', 'delivered'  => 'Delivered',
                        'canceled' => 'Canceled', 'refunded' => 'Refunded',
                    ])->required()->default('pending'),
                \Filament\Forms\Components\Select::make('payment_status')
                    ->options(['pending' => 'Pending', 'paid' => 'Paid', 'failed' => 'Failed', 'refunded' => 'Refunded'])
                    ->required()->default('pending'),
                \Filament\Forms\Components\Textarea::make('notes')->columnSpanFull(),
            ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()->copyable()->weight('bold')->color('primary'),
                Tables\Columns\TextColumn::make('customer.full_name')
                    ->label('Customer')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('items_count')
                    ->counts('items')->label('Items'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match($state) {
                        'delivered'  => 'success',
                        'processing' => 'info',
                        'shipped'    => 'primary',
                        'canceled', 'refunded' => 'danger',
                        default      => 'warning',
                    }),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match($state) {
                        'paid'     => 'success',
                        'failed'   => 'danger',
                        'refunded' => 'warning',
                        default    => 'gray',
                    }),
                Tables\Columns\TextColumn::make('total')->money('USD')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->since(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending', 'processing' => 'Processing',
                        'shipped' => 'Shipped', 'delivered'  => 'Delivered',
                        'canceled' => 'Canceled', 'refunded' => 'Refunded',
                    ]),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options(['pending' => 'Pending', 'paid' => 'Paid', 'failed' => 'Failed', 'refunded' => 'Refunded']),
            ])
            ->actions([
                \Filament\Actions\Action::make('markShipped')
                    ->label('Mark Shipped')
                    ->icon('heroicon-o-truck')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (Order $record) => $record->update(['status' => 'shipped']))
                    ->visible(fn (Order $record) => $record->status === 'processing'),
                ViewAction::make(),
                EditAction::make()
            ])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListOrders::route('/'),
            'create' => CreateOrder::route('/create'),
            'edit'   => EditOrder::route('/{record}/edit'),
        ];
    }
}
