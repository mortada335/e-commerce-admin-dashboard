<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Manually test form() and table() instantiation for all Pages and Resources
$resources = [
    \App\Filament\Resources\Users\UserResource::class,
    \App\Filament\Resources\Roles\RoleResource::class,
    \App\Filament\Resources\Coupons\CouponResource::class,
    \App\Filament\Resources\ActivityLogs\ActivityLogResource::class,
    \App\Filament\Resources\Categories\CategoryResource::class,
    \App\Filament\Resources\Customers\CustomerResource::class,
    \App\Filament\Resources\Orders\OrderResource::class,
    \App\Filament\Resources\Products\ProductResource::class,
    \App\Filament\Resources\Brands\BrandResource::class,
    \App\Filament\Resources\Reviews\ReviewResource::class,
    \App\Filament\Resources\Banners\BannerResource::class,
];

try {
    foreach ($resources as $resource) {
        $schema = $resource::form(new \Filament\Schemas\Schema());
        echo "[$resource] OK\n";
    }

    $page = app(\App\Filament\Pages\Settings::class);
    $schema = $page->form(new \Filament\Schemas\Schema());
    echo "[Settings Page] OK\n";

} catch (\Throwable $e) {
    echo "\nFATAL ERROR in {$e->getFile()}:{$e->getLine()}\n";
    echo $e->getMessage() . "\n";
    exit(1);
}

echo "\nAll Filament classes parsed successfully!\n";
