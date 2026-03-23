<?php

namespace App\Filament\Resources\ActivityLogs;

use App\Filament\Resources\ActivityLogs\Pages\ListActivityLogs;
use App\Models\ActivityLog;
use BackedEnum;
use Filament\Actions\ViewAction;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class ActivityLogResource extends Resource
{
    protected static ?string $model = ActivityLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected static ?int $navigationSort = 3;

    // Read-only — no create/edit
    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('action')
                    ->searchable()->badge()
                    ->color(fn (string $state) => match(true) {
                        str_contains($state, 'delete') => 'danger',
                        str_contains($state, 'create') => 'success',
                        str_contains($state, 'update') => 'warning',
                        str_contains($state, 'login')  => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Model')
                    ->formatStateUsing(fn ($state) => $state ? class_basename($state) : '—')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')->searchable()->default('System'),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP')->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()->sortable()->since(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('action')
                    ->options(
                        ActivityLog::distinct()->pluck('action', 'action')->toArray()
                    )->searchable(),
            ])
            ->actions([
                ViewAction::make(),
            ])
            ->bulkActions([])
            ->paginated([25, 50, 100]);
    }

    public static function canCreate(): bool
    {
        return false; // Audit logs are auto-generated only
    }

    public static function getPages(): array
    {
        return [
            'index' => ListActivityLogs::route('/'),
        ];
    }
}
