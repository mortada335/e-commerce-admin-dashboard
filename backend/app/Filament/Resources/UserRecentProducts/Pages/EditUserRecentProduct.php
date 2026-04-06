<?php

namespace App\Filament\Resources\UserRecentProducts\Pages;

use App\Filament\Resources\UserRecentProducts\UserRecentProductResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUserRecentProduct extends EditRecord
{
    protected static string $resource = UserRecentProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
