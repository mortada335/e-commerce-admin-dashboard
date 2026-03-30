<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ActivityLogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [DashboardController::class, 'stats']);
            Route::get('/sales-chart', [DashboardController::class, 'salesChart']);
            Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
            Route::get('/top-products', [DashboardController::class, 'topProducts']);
            Route::get('/order-status-summary', [DashboardController::class, 'orderStatusSummary']);
            Route::get('/new-customers', [DashboardController::class, 'newCustomers']);
            Route::get('/revenue-by-category', [DashboardController::class, 'revenueByCategory']);
        });

        // Products
        Route::get('/products/stats', [ProductController::class, 'stats']);
        Route::post('/products/bulk-status', [ProductController::class, 'bulkUpdateStatus']);
        Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);
        Route::get('/products/export', [ProductController::class, 'export']);
        Route::apiResource('products', ProductController::class);
        Route::post('/products/{product}/images', [ProductController::class, 'uploadImages']);
        Route::delete('/products/{product}/images/{imageId}', [ProductController::class, 'deleteImage']);

        // Categories & Brands
        Route::get('/categories/tree', [CategoryController::class, 'tree']);
        Route::get('/categories/export', [CategoryController::class, 'export']);
        Route::apiResource('categories', CategoryController::class);
        Route::get('/brands/export', [BrandController::class, 'export']);
        Route::apiResource('brands', BrandController::class);

        // Orders
        Route::get('/orders/stats', [OrderController::class, 'stats']);
        Route::post('/orders/bulk-status', [OrderController::class, 'bulkUpdateStatus']);
        Route::get('/orders/export', [OrderController::class, 'export']);
        Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'update']);
        Route::post('/orders/{order}/status', [OrderController::class, 'updateStatus']);

        // Customers
        Route::get('/customers/stats', [CustomerController::class, 'stats']);
        Route::get('/customers/export', [CustomerController::class, 'export']);
        Route::apiResource('customers', CustomerController::class);
        Route::get('/customers/{customer}/orders', [CustomerController::class, 'orders']);

        // Coupons
        Route::get('/coupons/stats', [CouponController::class, 'stats']);
        Route::post('/coupons/validate', [CouponController::class, 'validate']);
        Route::apiResource('coupons', CouponController::class);

        // Inventory
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::get('/inventory/stats', [InventoryController::class, 'stats']);
        Route::get('/inventory/alerts', [InventoryController::class, 'alerts']);
        Route::get('/inventory/history', [InventoryController::class, 'history']);
        Route::get('/inventory/export', [InventoryController::class, 'export']);
        Route::post('/inventory/bulk-update', [InventoryController::class, 'bulkUpdate']);
        Route::patch('/inventory/{product}/stock', [InventoryController::class, 'updateStock']);

        // Reviews
        Route::get('/reviews/stats', [ReviewController::class, 'stats']);
        Route::apiResource('reviews', ReviewController::class);
        Route::post('/reviews/{review}/toggle-approval', [ReviewController::class, 'toggleApproval']);

        // Banners
        Route::apiResource('banners', BannerController::class);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);

        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);

        // Notifications
        Route::get('/notifications', fn (Request $request) =>
            response()->json($request->user()->unreadNotifications)
        );
        Route::post('/notifications/{id}/read', function (Request $request, $id) {
            $notification = $request->user()->notifications()->findOrFail($id);
            $notification->markAsRead();
            return response()->json(['message' => 'Marked as read.']);
        });
        Route::post('/notifications/read-all', function (Request $request) {
            $request->user()->unreadNotifications->markAsRead();
            return response()->json(['message' => 'All marked as read.']);
        });
    });
});

