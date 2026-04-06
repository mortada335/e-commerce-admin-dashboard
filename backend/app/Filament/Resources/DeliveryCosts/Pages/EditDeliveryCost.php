<?php

namespace App\Filament\Resources\DeliveryCosts\Pages;

use App\Filament\Resources\DeliveryCosts\DeliveryCostResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDeliveryCost extends EditRecord
{
    protected static string $resource = DeliveryCostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
