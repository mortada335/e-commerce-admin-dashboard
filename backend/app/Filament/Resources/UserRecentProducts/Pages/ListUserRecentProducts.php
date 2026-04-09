<?php

namespace App\Filament\Resources\UserRecentProducts\Pages;

use App\Filament\Resources\UserRecentProducts\UserRecentProductResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserRecentProducts extends ListRecords
{
    protected static string $resource = UserRecentProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
