<?php

namespace App\Filament\Resources\DeliveryCosts\Pages;

use App\Filament\Resources\DeliveryCosts\DeliveryCostResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDeliveryCosts extends ListRecords
{
    protected static string $resource = DeliveryCostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
