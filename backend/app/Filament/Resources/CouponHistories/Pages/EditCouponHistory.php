<?php

namespace App\Filament\Resources\CouponHistories\Pages;

use App\Filament\Resources\CouponHistories\CouponHistoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCouponHistory extends EditRecord
{
    protected static string $resource = CouponHistoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
