<?php

namespace App\Filament\Resources\ProductVideos\Pages;

use App\Filament\Resources\ProductVideos\ProductVideoResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProductVideo extends CreateRecord
{
    protected static string $resource = ProductVideoResource::class;
}
