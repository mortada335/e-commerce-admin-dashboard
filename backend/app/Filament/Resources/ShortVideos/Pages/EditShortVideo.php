<?php

namespace App\Filament\Resources\ShortVideos\Pages;

use App\Filament\Resources\ShortVideos\ShortVideoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditShortVideo extends EditRecord
{
    protected static string $resource = ShortVideoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
