<?php

namespace App\Filament\Resources\SearchTags\Pages;

use App\Filament\Resources\SearchTags\SearchTagResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSearchTag extends EditRecord
{
    protected static string $resource = SearchTagResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
