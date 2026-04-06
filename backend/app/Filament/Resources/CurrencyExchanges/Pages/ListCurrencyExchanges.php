<?php

namespace App\Filament\Resources\CurrencyExchanges\Pages;

use App\Filament\Resources\CurrencyExchanges\CurrencyExchangeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCurrencyExchanges extends ListRecords
{
    protected static string $resource = CurrencyExchangeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
