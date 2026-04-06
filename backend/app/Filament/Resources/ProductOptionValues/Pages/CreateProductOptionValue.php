<?php

namespace App\Filament\Resources\ProductOptionValues\Pages;

use App\Filament\Resources\ProductOptionValues\ProductOptionValueResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProductOptionValue extends CreateRecord
{
    protected static string $resource = ProductOptionValueResource::class;
}
