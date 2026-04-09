<?php

namespace App\Filament\Resources\OrderTaskHistories\Pages;

use App\Filament\Resources\OrderTaskHistories\OrderTaskHistoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOrderTaskHistory extends EditRecord
{
    protected static string $resource = OrderTaskHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
