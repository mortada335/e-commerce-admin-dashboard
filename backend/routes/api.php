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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('v1')->group(function () {

    // Rate-limited login
    Route::post('/auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:login');

    // Health check (unauthenticated)
    Route::get('/health', function () {
        $dbOk = true;
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbOk = false;
        }

        $storageOk = is_writable(storage_path('app'));

        $status = $dbOk && $storageOk ? 'healthy' : 'degraded';

        return response()->json([
            'status'  => $status,
            'checks'  => [
                'database' => $dbOk ? 'ok' : 'fail',
                'storage'  => $storageOk ? 'ok' : 'fail',
            ],
            'version'   => '4.0.0',
            'timestamp' => now()->toISOString(),
        ], $status === 'healthy' ? 200 : 503);
    });

    // Protected routes — global API rate limit
    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

        // ── Auth ────────────────────────────────────────────────
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // ── Dashboard (view dashboard) ─────────────────────────
        Route::middleware('permission:view dashboard')->prefix('dashboard')->group(function () {
            Route::get('/stats', [DashboardController::class, 'stats']);
            Route::get('/sales-chart', [DashboardController::class, 'salesChart']);
            Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
            Route::get('/top-products', [DashboardController::class, 'topProducts']);
            Route::get('/order-status-summary', [DashboardController::class, 'orderStatusSummary']);
            Route::get('/new-customers', [DashboardController::class, 'newCustomers']);
            Route::get('/revenue-by-category', [DashboardController::class, 'revenueByCategory']);
        });

        // ── Products ──────────────────────────────────────────
        Route::middleware('permission:view products')->group(function () {
            Route::get('/products/stats', [ProductController::class, 'stats']);
            Route::get('/products/export', [ProductController::class, 'export'])->middleware('throttle:export');
            Route::get('/products', [ProductController::class, 'index']);
            Route::get('/products/{product}', [ProductController::class, 'show']);
        });
        Route::middleware('permission:manage products')->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
            Route::post('/products/{product}/images', [ProductController::class, 'uploadImages']);
            Route::delete('/products/{product}/images/{imageId}', [ProductController::class, 'deleteImage']);
            Route::post('/products/bulk-status', [ProductController::class, 'bulkUpdateStatus'])->middleware('throttle:bulk');
            Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete'])->middleware('throttle:bulk');
        });

        // ── Categories ────────────────────────────────────────
        Route::middleware('permission:view categories')->group(function () {
            Route::get('/categories/tree', [CategoryController::class, 'tree']);
            Route::get('/categories/export', [CategoryController::class, 'export'])->middleware('throttle:export');
            Route::get('/categories', [CategoryController::class, 'index']);
            Route::get('/categories/{category}', [CategoryController::class, 'show']);
        });
        Route::middleware('permission:manage categories')->group(function () {
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
        });

        // ── Brands ────────────────────────────────────────────
        Route::middleware('permission:view brands')->group(function () {
            Route::get('/brands', [BrandController::class, 'index']);
            Route::get('/brands/{brand}', [BrandController::class, 'show']);
            Route::get('/brands/export', [BrandController::class, 'export'])->middleware('throttle:export');
        });
        Route::middleware('permission:manage products')->group(function () {
            Route::post('/brands', [BrandController::class, 'store']);
            Route::put('/brands/{brand}', [BrandController::class, 'update']);
            Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);
        });

        // ── Orders ────────────────────────────────────────────
        Route::middleware('permission:view orders')->group(function () {
            Route::get('/orders/stats', [OrderController::class, 'stats']);
            Route::get('/orders/export', [OrderController::class, 'export'])->middleware('throttle:export');
            Route::get('/orders', [OrderController::class, 'index']);
            Route::get('/orders/{order}', [OrderController::class, 'show']);
        });
        Route::middleware('permission:manage orders')->group(function () {
            Route::put('/orders/{order}', [OrderController::class, 'update']);
            Route::post('/orders/{order}/status', [OrderController::class, 'updateStatus']);
            Route::post('/orders/bulk-status', [OrderController::class, 'bulkUpdateStatus'])->middleware('throttle:bulk');
        });

        // ── Customers ─────────────────────────────────────────
        Route::middleware('permission:view customers')->group(function () {
            Route::get('/customers/stats', [CustomerController::class, 'stats']);
            Route::get('/customers/export', [CustomerController::class, 'export'])->middleware('throttle:export');
            Route::get('/customers', [CustomerController::class, 'index']);
            Route::get('/customers/{customer}', [CustomerController::class, 'show']);
            Route::get('/customers/{customer}/orders', [CustomerController::class, 'orders']);
        });
        Route::middleware('permission:manage customers')->group(function () {
            Route::post('/customers', [CustomerController::class, 'store']);
            Route::put('/customers/{customer}', [CustomerController::class, 'update']);
            Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
        });

        // ── Coupons ───────────────────────────────────────────
        Route::middleware('permission:view coupons')->group(function () {
            Route::get('/coupons/stats', [CouponController::class, 'stats']);
            Route::get('/coupons', [CouponController::class, 'index']);
            Route::get('/coupons/{coupon}', [CouponController::class, 'show']);
        });
        Route::middleware('permission:manage coupons')->group(function () {
            Route::post('/coupons', [CouponController::class, 'store']);
            Route::put('/coupons/{coupon}', [CouponController::class, 'update']);
            Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy']);
            Route::post('/coupons/validate', [CouponController::class, 'validate']);
        });

        // ── Inventory ─────────────────────────────────────────
        Route::middleware('permission:view inventory')->group(function () {
            Route::get('/inventory', [InventoryController::class, 'index']);
            Route::get('/inventory/stats', [InventoryController::class, 'stats']);
            Route::get('/inventory/alerts', [InventoryController::class, 'alerts']);
            Route::get('/inventory/history', [InventoryController::class, 'history']);
            Route::get('/inventory/export', [InventoryController::class, 'export'])->middleware('throttle:export');
        });
        Route::middleware('permission:manage inventory')->group(function () {
            Route::patch('/inventory/{product}/stock', [InventoryController::class, 'updateStock']);
            Route::post('/inventory/bulk-update', [InventoryController::class, 'bulkUpdate'])->middleware('throttle:bulk');
        });

        // ── Reviews ───────────────────────────────────────────
        Route::middleware('permission:manage products')->group(function () {
            Route::get('/reviews/stats', [ReviewController::class, 'stats']);
            Route::apiResource('reviews', ReviewController::class);
            Route::post('/reviews/{review}/toggle-approval', [ReviewController::class, 'toggleApproval']);
        });

        // ── Banners ───────────────────────────────────────────
        Route::middleware('permission:manage products')->group(function () {
            Route::apiResource('banners', BannerController::class);
        });

        // ── Settings (admin only) ─────────────────────────────
        Route::middleware('role:admin')->group(function () {
            Route::get('/settings', [SettingController::class, 'index']);
            Route::put('/settings', [SettingController::class, 'update']);
        });

        // ── Activity Logs ─────────────────────────────────────
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])
            ->middleware('permission:view dashboard');

        // ── Notifications ─────────────────────────────────────
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
