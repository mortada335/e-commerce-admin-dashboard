<?php

namespace App\Filament\Resources\CouponHistories\Pages;

use App\Filament\Resources\CouponHistories\CouponHistoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCouponHistories extends ListRecords
{
    protected static string $resource = CouponHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
