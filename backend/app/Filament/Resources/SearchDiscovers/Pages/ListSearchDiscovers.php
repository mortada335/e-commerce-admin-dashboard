<?php

namespace App\Filament\Resources\SearchDiscovers\Pages;

use App\Filament\Resources\SearchDiscovers\SearchDiscoverResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSearchDiscovers extends ListRecords
{
    protected static string $resource = SearchDiscoverResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
