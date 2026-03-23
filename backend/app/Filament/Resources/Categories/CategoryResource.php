<?php

namespace App\Filament\Resources\Categories;

use App\Filament\Resources\Categories\Pages\CreateCategory;
use App\Filament\Resources\Categories\Pages\EditCategory;
use App\Filament\Resources\Categories\Pages\ListCategories;
use App\Models\Category;
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
use Illuminate\Support\Str;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFolderOpen;

    protected static string|\UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('Category Details')->schema([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()->maxLength(255)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, \Filament\Forms\Set $set) =>
                        $set('slug', Str::slug($state))),
                \Filament\Forms\Components\TextInput::make('slug')
                    ->required()->unique(ignoreRecord: true),
                \Filament\Forms\Components\Select::make('parent_id')
                    ->label('Parent Category')
                    ->relationship('parent', 'name')
                    ->searchable()->preload(),
                \Filament\Forms\Components\Textarea::make('description')
                    ->columnSpanFull()->maxLength(500),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->square()
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name=' . urlencode($record->name) . '&color=7F9CF5&background=EBF4FF'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()->copyable()->color('gray'),
                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Parent Category')->sortable(),
                Tables\Columns\TextColumn::make('products_count')
                    ->counts('products')->label('Products'),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()->sortable()->since(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('parent_id')
                    ->label('Parent Category')
                    ->relationship('parent', 'name'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListCategories::route('/'),
            'create' => CreateCategory::route('/create'),
            'edit'   => EditCategory::route('/{record}/edit'),
        ];
    }
}
