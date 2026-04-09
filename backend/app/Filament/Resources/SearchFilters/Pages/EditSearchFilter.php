<?php

namespace App\Filament\Resources\SearchFilters\Pages;

use App\Filament\Resources\SearchFilters\SearchFilterResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSearchFilter extends EditRecord
{
    protected static string $resource = SearchFilterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
