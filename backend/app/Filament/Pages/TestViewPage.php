<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class TestViewPage extends Page
{
    protected static bool $shouldRegisterNavigation = false;

    protected string $view = 'filament.pages.test-view-page';
}
