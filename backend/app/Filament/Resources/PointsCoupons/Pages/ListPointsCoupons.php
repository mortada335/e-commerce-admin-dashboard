<?php

namespace App\Filament\Resources\PointsCoupons\Pages;

use App\Filament\Resources\PointsCoupons\PointsCouponResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPointsCoupons extends ListRecords
{
    protected static string $resource = PointsCouponResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
