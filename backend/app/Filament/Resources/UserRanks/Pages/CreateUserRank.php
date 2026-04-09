<?php

namespace App\Filament\Resources\UserRanks\Pages;

use App\Filament\Resources\UserRanks\UserRankResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserRank extends CreateRecord
{
    protected static string $resource = UserRankResource::class;
}
