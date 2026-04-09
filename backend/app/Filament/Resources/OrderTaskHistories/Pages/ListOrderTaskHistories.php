<?php

namespace App\Filament\Resources\OrderTaskHistories\Pages;

use App\Filament\Resources\OrderTaskHistories\OrderTaskHistoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOrderTaskHistories extends ListRecords
{
    protected static string $resource = OrderTaskHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
