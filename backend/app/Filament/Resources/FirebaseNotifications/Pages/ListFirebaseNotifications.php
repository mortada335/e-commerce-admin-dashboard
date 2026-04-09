<?php

namespace App\Filament\Resources\FirebaseNotifications\Pages;

use App\Filament\Resources\FirebaseNotifications\FirebaseNotificationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFirebaseNotifications extends ListRecords
{
    protected static string $resource = FirebaseNotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
