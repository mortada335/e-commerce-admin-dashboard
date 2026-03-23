<?php

namespace App\Filament\Resources\Coupons;

use App\Filament\Resources\Coupons\Pages\CreateCoupon;
use App\Filament\Resources\Coupons\Pages\EditCoupon;
use App\Filament\Resources\Coupons\Pages\ListCoupons;
use App\Models\Coupon;
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

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;

    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('Coupon Details')->schema([
                \Filament\Forms\Components\TextInput::make('code')
                    ->required()->maxLength(50)
                    ->afterStateUpdated(fn ($state, \Filament\Forms\Set $set) =>
                        $set('code', strtoupper($state)))
                    ->live(onBlur: true),
                \Filament\Forms\Components\Textarea::make('description')->maxLength(255),
                \Filament\Forms\Components\Select::make('type')
                    ->options(['percentage' => 'Percentage (%)', 'fixed' => 'Fixed Amount ($)'])
                    ->required()->live(),
                \Filament\Forms\Components\TextInput::make('value')
                    ->numeric()->required()->minValue(0)
                    ->prefix(fn (\Filament\Schemas\Components\Utilities\Get $get) => $get('type') === 'percentage' ? '%' : '$'),
            ])->columns(2),

            \Filament\Schemas\Components\Section::make('Restrictions')->schema([
                \Filament\Forms\Components\TextInput::make('min_order_amount')
                    ->numeric()->prefix('$')->label('Min. Order Amount'),
                \Filament\Forms\Components\TextInput::make('max_discount_amount')
                    ->numeric()->prefix('$')->label('Max. Discount Amount'),
                \Filament\Forms\Components\TextInput::make('max_uses')
                    ->integer()->label('Max Total Uses'),
                \Filament\Forms\Components\TextInput::make('max_uses_per_user')
                    ->integer()->label('Max Uses Per User'),
                \Filament\Forms\Components\DateTimePicker::make('starts_at'),
                \Filament\Forms\Components\DateTimePicker::make('expires_at'),
                \Filament\Forms\Components\Toggle::make('is_active')->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->searchable()->copyable()->weight('bold'),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state) => $state === 'percentage' ? 'info' : 'success'),
                Tables\Columns\TextColumn::make('value')
                    ->formatStateUsing(fn ($state, $record) =>
                        $record->type === 'percentage' ? "{$state}%" : "\${$state}")
                    ->label('Discount'),
                Tables\Columns\TextColumn::make('used_count')
                    ->label('Used')
                    ->formatStateUsing(fn ($state, $record) =>
                        $record->max_uses ? "{$state}/{$record->max_uses}" : $state)
                    ->sortable(),
                Tables\Columns\TextColumn::make('min_order_amount')
                    ->money('USD')->label('Min. Order')->toggleable(),
                Tables\Columns\IconColumn::make('is_active')->boolean()->label('Active'),
                Tables\Columns\TextColumn::make('expires_at')
                    ->dateTime()->sortable()->label('Expires'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options(['percentage' => 'Percentage', 'fixed' => 'Fixed']),
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListCoupons::route('/'),
            'create' => CreateCoupon::route('/create'),
            'edit'   => EditCoupon::route('/{record}/edit'),
        ];
    }
}
