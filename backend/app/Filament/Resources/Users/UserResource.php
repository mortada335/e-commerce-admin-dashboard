<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
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
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('User Details')->schema([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()->maxLength(255),
                \Filament\Forms\Components\TextInput::make('email')
                    ->email()->required()->unique(ignoreRecord: true),
                \Filament\Forms\Components\TextInput::make('password')
                    ->password()->revealable()
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $operation): bool => $operation === 'create')
                    ->label(fn (string $operation) => $operation === 'create' ? 'Password' : 'New Password (leave blank to keep current)'),
                \Filament\Forms\Components\Toggle::make('is_active')
                    ->label('Active Account')->default(true),
            ])->columns(2),

            \Filament\Schemas\Components\Section::make('Role & Permissions')->schema([
                \Filament\Forms\Components\Select::make('roles')
                    ->label('Role')
                    ->multiple()
                    ->relationship('roles', 'name')
                    ->preload(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()->sortable()->copyable(),
                Tables\Columns\TextColumn::make('roles.name')
                    ->label('Roles')->badge()->separator(','),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()->label('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('roles')
                    ->relationship('roles', 'name')
                    ->preload()->label('Role'),
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit'   => EditUser::route('/{record}/edit'),
        ];
    }
}
