<?php

namespace App\Filament\Resources\ProductVideos\Pages;

use App\Filament\Resources\ProductVideos\ProductVideoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProductVideo extends EditRecord
{
    protected static string $resource = ProductVideoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
