<?php

namespace App\Filament\Resources\SearchDiscovers\Pages;

use App\Filament\Resources\SearchDiscovers\SearchDiscoverResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSearchDiscover extends EditRecord
{
    protected static string $resource = SearchDiscoverResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
