<?php

namespace App\Filament\Resources\UserSearches\Pages;

use App\Filament\Resources\UserSearches\UserSearchResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUserSearch extends EditRecord
{
    protected static string $resource = UserSearchResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
