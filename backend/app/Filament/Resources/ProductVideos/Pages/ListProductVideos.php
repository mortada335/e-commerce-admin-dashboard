<?php

namespace App\Filament\Resources\ProductVideos\Pages;

use App\Filament\Resources\ProductVideos\ProductVideoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListProductVideos extends ListRecords
{
    protected static string $resource = ProductVideoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
