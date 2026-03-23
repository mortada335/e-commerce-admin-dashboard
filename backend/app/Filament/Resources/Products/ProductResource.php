<?php

namespace App\Filament\Resources\Products;

use App\Filament\Resources\Products\Pages\CreateProduct;
use App\Filament\Resources\Products\Pages\EditProduct;
use App\Filament\Resources\Products\Pages\ListProducts;
use App\Models\Category;
use App\Models\Product;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    protected static string|\UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('Product Details')->schema([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()->maxLength(255)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, \Filament\Forms\Set $set) =>
                        $set('slug', Str::slug($state))),
                \Filament\Forms\Components\TextInput::make('slug')
                    ->required()->unique(ignoreRecord: true),
                \Filament\Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                \Filament\Forms\Components\Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->searchable()
                    ->preload(),
                \Filament\Forms\Components\Textarea::make('description')
                    ->columnSpanFull(),
                \Filament\Forms\Components\Textarea::make('short_description')
                    ->columnSpanFull()->maxLength(500),
            ])->columns(2),

            \Filament\Schemas\Components\Section::make('Pricing & Inventory')->schema([
                \Filament\Forms\Components\TextInput::make('sku')
                    ->required()->unique(ignoreRecord: true),
                \Filament\Forms\Components\TextInput::make('price')
                    ->required()->numeric()->prefix('$'),
                \Filament\Forms\Components\TextInput::make('discount_price')
                    ->numeric()->prefix('$'),
                \Filament\Forms\Components\TextInput::make('stock_quantity')
                    ->required()->integer()->default(0),
                \Filament\Forms\Components\TextInput::make('low_stock_threshold')
                    ->integer()->default(10),
                \Filament\Forms\Components\TextInput::make('weight')
                    ->numeric()->suffix('kg'),
            ])->columns(3),

            \Filament\Schemas\Components\Section::make('Status')->schema([
                \Filament\Forms\Components\Select::make('status')
                    ->options(['active' => 'Active', 'inactive' => 'Inactive', 'draft' => 'Draft'])
                    ->required()->default('active'),
                \Filament\Forms\Components\Toggle::make('is_featured')
                    ->label('Featured Product'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('images.0.path')
                    ->label('Thumbnail')
                    ->square()
                    ->defaultImageUrl(url('https://ui-avatars.com/api/?name=P&color=7F9CF5&background=EBF4FF')),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn ($record) => Str::limit($record->short_description ?? '', 40)),
                Tables\Columns\TextColumn::make('sku')
                    ->searchable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('brand.name')
                    ->label('Brand')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stock_quantity')
                    ->label('Stock')
                    ->sortable()
                    ->numeric()
                    ->color(fn ($record) => $record->isLowStock() ? 'danger' : 'success'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match($state) {
                        'active'   => 'success',
                        'draft'    => 'warning',
                        'inactive' => 'danger',
                        default    => 'gray',
                    }),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(['active' => 'Active', 'inactive' => 'Inactive', 'draft' => 'Draft']),
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id')),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListProducts::route('/'),
            'create' => CreateProduct::route('/create'),
            'edit'   => EditProduct::route('/{record}/edit'),
        ];
    }
}
