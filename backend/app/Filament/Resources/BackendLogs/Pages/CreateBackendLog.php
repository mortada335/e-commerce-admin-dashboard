<?php

namespace App\Filament\Resources\BackendLogs\Pages;

use App\Filament\Resources\BackendLogs\BackendLogResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBackendLog extends CreateRecord
{
    protected static string $resource = BackendLogResource::class;
}
