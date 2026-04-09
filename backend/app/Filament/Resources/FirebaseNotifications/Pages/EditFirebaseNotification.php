<?php

namespace App\Filament\Resources\FirebaseNotifications\Pages;

use App\Filament\Resources\FirebaseNotifications\FirebaseNotificationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFirebaseNotification extends EditRecord
{
    protected static string $resource = FirebaseNotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
