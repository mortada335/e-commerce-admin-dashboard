<?php

namespace App\Filament\Resources\PointsCoupons\Pages;

use App\Filament\Resources\PointsCoupons\PointsCouponResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPointsCoupon extends EditRecord
{
    protected static string $resource = PointsCouponResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
