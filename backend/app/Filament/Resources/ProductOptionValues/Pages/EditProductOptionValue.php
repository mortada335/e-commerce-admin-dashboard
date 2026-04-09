<?php

namespace App\Filament\Resources\ProductOptionValues\Pages;

use App\Filament\Resources\ProductOptionValues\ProductOptionValueResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProductOptionValue extends EditRecord
{
    protected static string $resource = ProductOptionValueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
