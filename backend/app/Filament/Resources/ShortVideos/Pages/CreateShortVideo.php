<?php

namespace App\Filament\Resources\ShortVideos\Pages;

use App\Filament\Resources\ShortVideos\ShortVideoResource;
use Filament\Resources\Pages\CreateRecord;

class CreateShortVideo extends CreateRecord
{
    protected static string $resource = ShortVideoResource::class;
}
