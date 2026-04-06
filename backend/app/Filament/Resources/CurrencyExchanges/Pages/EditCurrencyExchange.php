<?php

namespace App\Filament\Resources\CurrencyExchanges\Pages;

use App\Filament\Resources\CurrencyExchanges\CurrencyExchangeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCurrencyExchange extends EditRecord
{
    protected static string $resource = CurrencyExchangeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
