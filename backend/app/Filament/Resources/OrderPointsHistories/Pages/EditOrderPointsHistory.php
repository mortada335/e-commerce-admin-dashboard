<?php

namespace App\Filament\Resources\OrderPointsHistories\Pages;

use App\Filament\Resources\OrderPointsHistories\OrderPointsHistoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOrderPointsHistory extends EditRecord
{
    protected static string $resource = OrderPointsHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
