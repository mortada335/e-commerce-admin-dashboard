<?php

namespace App\Filament\Resources\UserCarts\Pages;

use App\Filament\Resources\UserCarts\UserCartResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserCart extends CreateRecord
{
    protected static string $resource = UserCartResource::class;
}
