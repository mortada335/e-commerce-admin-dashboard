<?php

namespace App\Filament\Resources\UserRecentProducts\Pages;

use App\Filament\Resources\UserRecentProducts\UserRecentProductResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserRecentProduct extends CreateRecord
{
    protected static string $resource = UserRecentProductResource::class;
}
