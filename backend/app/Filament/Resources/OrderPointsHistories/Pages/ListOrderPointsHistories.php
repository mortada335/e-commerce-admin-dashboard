<?php

namespace App\Filament\Resources\OrderPointsHistories\Pages;

use App\Filament\Resources\OrderPointsHistories\OrderPointsHistoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOrderPointsHistories extends ListRecords
{
    protected static string $resource = OrderPointsHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
