<?php

namespace App\Filament\Resources\ScheduledNotifications\Pages;

use App\Filament\Resources\ScheduledNotifications\ScheduledNotificationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditScheduledNotification extends EditRecord
{
    protected static string $resource = ScheduledNotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
