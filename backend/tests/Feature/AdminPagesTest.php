<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminPagesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test all Filament resource pages load without 500 errors.
     */
    public function test_all_filament_admin_pages_load_successfully(): void
    {
        // 1. Create a super admin user to bypass any permission checks
        $user = User::firstOrCreate(
            ['email' => 'admin_test@example.com'],
            [
                'name' => 'Admin Test',
                'first_name' => 'Admin',
                'last_name' => 'Test',
                'password' => bcrypt('password'),
            ]
        );

        // Ensure the Super Admin role exists and assign it
        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $user->assignRole($role);

        // 2. Authenticate
        $this->actingAs($user);

        // 3. Get all registered resources from Filament
        $resources = \Filament\Facades\Filament::getResources();
        $this->assertNotEmpty($resources, 'No Filament resources found.');

        $failedUrls = [];

        foreach ($resources as $resource) {
            $pages = $resource::getPages();

            foreach (['index', 'create'] as $pageKey) {
                if (isset($pages[$pageKey])) {
                    $url = $resource::getUrl($pageKey);
                    
                    $response = $this->get($url);
                    
                    if ($response->status() !== 200) {
                        $failedUrls[] = [
                            'url' => $url,
                            'status' => $response->status(),
                            'error' => $response->exception ? $response->exception->getMessage() : 'Unknown Error'
                        ];
                        // Print exceptions if they exist
                        if ($response->exception) {
                            echo "Exception on $url: " . $response->exception->getMessage() . "\n";
                        }
                    }
                }
            }
        }

        // Test custom Settings page
        $settingsUrl = \App\Filament\Pages\Settings::getUrl();
        $response = $this->get($settingsUrl);
        if ($response->status() !== 200) {
            $failedUrls[] = [
                'url' => $settingsUrl,
                'status' => $response->status(),
                'error' => $response->exception ? $response->exception->getMessage() : 'Unknown Error'
            ];
            if ($response->exception) echo "Exception on $settingsUrl: " . $response->exception->getMessage() . "\n";
        }

        $this->assertEmpty($failedUrls, "The following admin URLs failed to load: \n" . print_r($failedUrls, true));
    }
}
