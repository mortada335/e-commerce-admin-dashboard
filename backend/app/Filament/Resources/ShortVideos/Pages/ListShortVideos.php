<?php

namespace App\Filament\Resources\ShortVideos\Pages;

use App\Filament\Resources\ShortVideos\ShortVideoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListShortVideos extends ListRecords
{
    protected static string $resource = ShortVideoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
