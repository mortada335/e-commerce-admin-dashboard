<?php

namespace App\Filament\Resources\UserRanks\Pages;

use App\Filament\Resources\UserRanks\UserRankResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUserRank extends EditRecord
{
    protected static string $resource = UserRankResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
