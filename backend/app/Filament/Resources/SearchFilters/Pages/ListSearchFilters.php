<?php

namespace App\Filament\Resources\SearchFilters\Pages;

use App\Filament\Resources\SearchFilters\SearchFilterResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSearchFilters extends ListRecords
{
    protected static string $resource = SearchFilterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
