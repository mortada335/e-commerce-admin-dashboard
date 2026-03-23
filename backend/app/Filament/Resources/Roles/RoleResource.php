<?php

namespace App\Filament\Resources\Roles;

use App\Filament\Resources\Roles\Pages\CreateRole;
use App\Filament\Resources\Roles\Pages\EditRole;
use App\Filament\Resources\Roles\Pages\ListRoles;
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
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('Role Details')->schema([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()->maxLength(255)->unique(ignoreRecord: true),
                \Filament\Forms\Components\Select::make('guard_name')
                    ->options(['web' => 'Web', 'api' => 'API'])
                    ->required()->default('web'),
            ])->columns(2),

            \Filament\Schemas\Components\Section::make('Permissions')->schema([
                \Filament\Forms\Components\CheckboxList::make('permissions')
                    ->relationship('permissions', 'name')
                    ->options(Permission::orderBy('name')->pluck('name', 'id'))
                    ->columns(3)
                    ->bulkToggleable(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()->sortable(),
                Tables\Columns\TextColumn::make('guard_name')
                    ->badge()->color('info'),
                Tables\Columns\TextColumn::make('permissions_count')
                    ->counts('permissions')->label('Permissions'),
                Tables\Columns\TextColumn::make('users_count')
                    ->counts('users')->label('Users'),
            ])
            ->filters([])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListRoles::route('/'),
            'create' => CreateRole::route('/create'),
            'edit'   => EditRole::route('/{record}/edit'),
        ];
    }
}
