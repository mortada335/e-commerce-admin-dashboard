<?php

namespace App\Filament\Resources\SearchTags\Pages;

use App\Filament\Resources\SearchTags\SearchTagResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSearchTags extends ListRecords
{
    protected static string $resource = SearchTagResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
