<?php

/**
 * E-Commerce Admin Dashboard — API Routes
 *
 * All routes match the swagger admin YAML specification.
 * Auth: Both "Token <key>" and "Bearer <key>" header formats are supported.
 */

use App\Http\Controllers\Api\AddressAdminController;
use App\Http\Controllers\Api\AdminAttributeController;
use App\Http\Controllers\Api\AdminProductAttributeController;
use App\Http\Controllers\Api\AppIconController;
use App\Http\Controllers\Api\AttributeGroupController;
use App\Http\Controllers\Api\AuditLogAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BackendLogController;
use App\Http\Controllers\Api\BannerAdminController;
use App\Http\Controllers\Api\BrandAdminController;
use App\Http\Controllers\Api\CategoryAdminController;
use App\Http\Controllers\Api\CouponAdminController;
use App\Http\Controllers\Api\CouponHistoryController;
use App\Http\Controllers\Api\CurrencyExchangeController;
use App\Http\Controllers\Api\CustomerMembershipController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DeliveryCostController;
use App\Http\Controllers\Api\DeliveryServiceController;
use App\Http\Controllers\Api\DiscountOperationController;
use App\Http\Controllers\Api\FcmController;
use App\Http\Controllers\Api\FirebaseNotificationController;
use App\Http\Controllers\Api\HomeSectionController;
use App\Http\Controllers\Api\MiscController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\OrderAdminController;
use App\Http\Controllers\Api\OrderExcelController;
use App\Http\Controllers\Api\OrderPointsHistoryController;
use App\Http\Controllers\Api\OrderProductController;
use App\Http\Controllers\Api\OrderTaskHistoryController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PointsCouponController;
use App\Http\Controllers\Api\PopupController;
use App\Http\Controllers\Api\ProductAdminController;
use App\Http\Controllers\Api\ProductImageAdminController;
use App\Http\Controllers\Api\ProductOptionTypeController;
use App\Http\Controllers\Api\ProductOptionTypeValueController;
use App\Http\Controllers\Api\ProductOptionValueController;
use App\Http\Controllers\Api\ProductVideoController;
use App\Http\Controllers\Api\ReferralCodeController;
use App\Http\Controllers\Api\ScheduledNotificationController;
use App\Http\Controllers\Api\SearchDiscoverController;
use App\Http\Controllers\Api\SearchFilterController;
use App\Http\Controllers\Api\SearchTagController;
use App\Http\Controllers\Api\ShortVideoController;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\StaticPageController;
use App\Http\Controllers\Api\SurveyController;
use App\Http\Controllers\Api\TemporaryDisableController;
use App\Http\Controllers\Api\UserCartController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserLoginController;
use App\Http\Controllers\Api\UserRankController;
use App\Http\Controllers\Api\UserRecentProductController;
use App\Http\Controllers\Api\UserSearchHistoryController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// ══════════════════════════════════════════════════════════════
// PUBLIC ROUTES (no auth required)
// ══════════════════════════════════════════════════════════════

// POST /login_admin/  — Admin login
Route::post('/login_admin', [AuthController::class, 'login']);

// GET /admin/me/  — Current user (optional auth)
Route::get('/admin/me', [AuthController::class, 'me'])
    ->middleware('auth:sanctum');

// GET /health  — Health check
Route::get('/health', function () {
    $dbOk = true;
    try { DB::connection()->getPdo(); } catch (\Exception $e) { $dbOk = false; }
    $storageOk = is_writable(storage_path('app'));
    $status = $dbOk && $storageOk ? 'healthy' : 'degraded';
    return response()->json([
        'status'  => $status,
        'checks'  => ['database' => $dbOk ? 'ok' : 'fail', 'storage' => $storageOk ? 'ok' : 'fail'],
        'version' => '1.0.0',
        'timestamp' => now()->toISOString(),
    ], $status === 'healthy' ? 200 : 503);
});


// ══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (Token / Bearer auth required)
// ══════════════════════════════════════════════════════════════

Route::middleware(['auth:sanctum'])->group(function () {

    // ── Auth ─────────────────────────────────────────────────
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

    // ── User Management ──────────────────────────────────────
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::patch('/users/{id}', [UserController::class, 'partialUpdate']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::post('/create-admin', [UserController::class, 'createAdmin']);
    Route::post('/create-user', [UserController::class, 'store']);
    Route::post('/change-user-status', [UserController::class, 'changeStatus']);

    Route::get('/deleted-users', [UserController::class, 'deletedUsers']);
    Route::get('/deleted-users/{id}', [UserController::class, 'deletedUserDetail']);

    Route::get('/export-users-csv', [UserController::class, 'exportCsv']);
    Route::get('/export-users-csv/{id}', [UserController::class, 'exportCsvDetail']);

    // ── Permissions ──────────────────────────────────────────
    Route::post('/add_permissions_to_user', [PermissionController::class, 'addPermissionsToUser']);
    Route::get('/models_permissions', [PermissionController::class, 'modelsPermissions']);

    // ── User Logins ──────────────────────────────────────────
    Route::get('/user_last_login', [UserLoginController::class, 'index']);
    Route::get('/user_last_login/{id}', [UserLoginController::class, 'show']);
    Route::post('/user_last_login', [UserLoginController::class, 'store']);
    Route::put('/user_last_login/{id}', [UserLoginController::class, 'update']);
    Route::patch('/user_last_login/{id}', [UserLoginController::class, 'partialUpdate']);
    Route::delete('/user_last_login/{id}', [UserLoginController::class, 'destroy']);

    // ── Address Admin ────────────────────────────────────────
    Route::get('/address_admin', [AddressAdminController::class, 'index']);
    Route::post('/address_admin', [AddressAdminController::class, 'store']);
    Route::get('/address_admin/{id}', [AddressAdminController::class, 'show']);
    Route::put('/address_admin/{id}', [AddressAdminController::class, 'update']);
    Route::patch('/address_admin/{id}', [AddressAdminController::class, 'partialUpdate']);
    Route::delete('/address_admin/{id}', [AddressAdminController::class, 'destroy']);

    // ── Admin Attributes ─────────────────────────────────────
    Route::get('/admin-attributes', [AdminAttributeController::class, 'index']);
    Route::post('/admin-attributes', [AdminAttributeController::class, 'store']);
    Route::get('/admin-attributes/{attribute_id}', [AdminAttributeController::class, 'show']);
    Route::put('/admin-attributes/{attribute_id}', [AdminAttributeController::class, 'update']);
    Route::patch('/admin-attributes/{attribute_id}', [AdminAttributeController::class, 'partialUpdate']);
    Route::delete('/admin-attributes/{attribute_id}', [AdminAttributeController::class, 'destroy']);

    // ── Admin Product Attributes ─────────────────────────────
    Route::get('/admin-product-attributes', [AdminProductAttributeController::class, 'index']);
    Route::post('/admin-product-attributes', [AdminProductAttributeController::class, 'store']);
    Route::get('/admin-product-attributes/{id}', [AdminProductAttributeController::class, 'show']);
    Route::put('/admin-product-attributes/{id}', [AdminProductAttributeController::class, 'update']);
    Route::patch('/admin-product-attributes/{id}', [AdminProductAttributeController::class, 'partialUpdate']);
    Route::delete('/admin-product-attributes/delete_attribute', [AdminProductAttributeController::class, 'deleteAttribute']);
    Route::delete('/delete-admin-product-attributes', [AdminProductAttributeController::class, 'deleteAttribute']);

    // ── Product Attribute Groups ─────────────────────────────
    Route::get('/product_attributes_group', [AttributeGroupController::class, 'index']);
    Route::post('/product_attributes_group', [AttributeGroupController::class, 'store']);
    Route::get('/product_attributes_group/{id}', [AttributeGroupController::class, 'show']);
    Route::put('/product_attributes_group/{id}', [AttributeGroupController::class, 'update']);
    Route::patch('/product_attributes_group/{id}', [AttributeGroupController::class, 'partialUpdate']);
    Route::delete('/product_attributes_group/{id}', [AttributeGroupController::class, 'destroy']);

    // ── Products Admin ───────────────────────────────────────
    Route::get('/products_admin', [ProductAdminController::class, 'index']);
    Route::post('/products_admin', [ProductAdminController::class, 'store']);
    Route::get('/products_admin/{id}', [ProductAdminController::class, 'show']);
    Route::put('/products_admin/{id}', [ProductAdminController::class, 'update']);
    Route::patch('/products_admin/{id}', [ProductAdminController::class, 'partialUpdate']);
    Route::delete('/products_admin/{id}', [ProductAdminController::class, 'destroy']);
    Route::post('/products_admin/bulk_add_categories', [ProductAdminController::class, 'bulkAddCategories']);
    Route::post('/products_admin/bulk_price_update', [ProductAdminController::class, 'bulkPriceUpdate']);
    Route::post('/products_admin/bulk_status_update', [ProductAdminController::class, 'bulkStatusUpdate']);

    // ── Products Search HTML ─────────────────────────────────
    Route::get('/products_search_html', [ProductAdminController::class, 'searchHtml']);
    Route::get('/products_search_html/{id}', [ProductAdminController::class, 'searchHtmlDetail']);

    // ── Product Options Types ────────────────────────────────
    Route::get('/product_options_types', [ProductOptionTypeController::class, 'index']);
    Route::post('/product_options_types', [ProductOptionTypeController::class, 'store']);
    Route::get('/product_options_types/{id}', [ProductOptionTypeController::class, 'show']);
    Route::put('/product_options_types/{id}', [ProductOptionTypeController::class, 'update']);
    Route::patch('/product_options_types/{id}', [ProductOptionTypeController::class, 'partialUpdate']);
    Route::delete('/product_options_types/{id}', [ProductOptionTypeController::class, 'destroy']);

    // ── Product Options Type Values ──────────────────────────
    Route::get('/product_options_type_values', [ProductOptionTypeValueController::class, 'index']);
    Route::post('/product_options_type_values', [ProductOptionTypeValueController::class, 'store']);
    Route::get('/product_options_type_values/{option_value_id}', [ProductOptionTypeValueController::class, 'show']);
    Route::put('/product_options_type_values/{option_value_id}', [ProductOptionTypeValueController::class, 'update']);
    Route::patch('/product_options_type_values/{option_value_id}', [ProductOptionTypeValueController::class, 'partialUpdate']);
    Route::delete('/product_options_type_values/{option_value_id}', [ProductOptionTypeValueController::class, 'destroy']);

    // ── Product Option Values ────────────────────────────────
    Route::get('/product_options_value', [ProductOptionValueController::class, 'index']);
    Route::post('/product_options_value', [ProductOptionValueController::class, 'store']);
    Route::get('/product_options_value/{product_option_value_id}', [ProductOptionValueController::class, 'show']);
    Route::put('/product_options_value/{product_option_value_id}', [ProductOptionValueController::class, 'update']);
    Route::patch('/product_options_value/{product_option_value_id}', [ProductOptionValueController::class, 'partialUpdate']);
    Route::delete('/product_options_value/{product_option_value_id}', [ProductOptionValueController::class, 'destroy']);

    // ── Product Videos ───────────────────────────────────────
    Route::get('/product-video-admin', [ProductVideoController::class, 'index']);
    Route::post('/product-video-admin', [ProductVideoController::class, 'store']);
    Route::get('/product-video-admin/{id}', [ProductVideoController::class, 'show']);
    Route::put('/product-video-admin/{id}', [ProductVideoController::class, 'update']);
    Route::patch('/product-video-admin/{id}', [ProductVideoController::class, 'partialUpdate']);
    Route::delete('/product-video-admin/{id}', [ProductVideoController::class, 'destroy']);

    // ── Product Images ───────────────────────────────────────
    Route::get('/product_images', [ProductImageAdminController::class, 'index']);
    Route::post('/product_images', [ProductImageAdminController::class, 'store']);
    Route::get('/product_images/{product_image_id}', [ProductImageAdminController::class, 'show']);
    Route::put('/product_images/{product_image_id}', [ProductImageAdminController::class, 'update']);
    Route::patch('/product_images/{product_image_id}', [ProductImageAdminController::class, 'partialUpdate']);
    Route::delete('/product_images/{product_image_id}', [ProductImageAdminController::class, 'destroy']);

    // ── Categories Admin ─────────────────────────────────────
    Route::get('/categories_admin', [CategoryAdminController::class, 'index']);
    Route::post('/categories_admin', [CategoryAdminController::class, 'store']);
    Route::get('/categories_admin/{category_id}', [CategoryAdminController::class, 'show']);
    Route::put('/categories_admin/{category_id}', [CategoryAdminController::class, 'update']);
    Route::patch('/categories_admin/{category_id}', [CategoryAdminController::class, 'partialUpdate']);
    Route::delete('/categories_admin/{category_id}', [CategoryAdminController::class, 'destroy']);

    // ── Brands Admin ─────────────────────────────────────────
    Route::get('/brands_admin', [BrandAdminController::class, 'index']);
    Route::post('/brands_admin', [BrandAdminController::class, 'store']);
    Route::get('/brands_admin/{manufacturer_id}', [BrandAdminController::class, 'show']);
    Route::put('/brands_admin/{manufacturer_id}', [BrandAdminController::class, 'update']);
    Route::patch('/brands_admin/{manufacturer_id}', [BrandAdminController::class, 'partialUpdate']);
    Route::delete('/brands_admin/{manufacturer_id}', [BrandAdminController::class, 'destroy']);

    // ── Orders Admin ─────────────────────────────────────────
    Route::get('/orders_admin', [OrderAdminController::class, 'index']);
    Route::post('/orders_admin', [OrderAdminController::class, 'store']);
    Route::get('/orders_admin/{order_id}', [OrderAdminController::class, 'show']);
    Route::put('/orders_admin/{order_id}', [OrderAdminController::class, 'update']);
    Route::patch('/orders_admin/{order_id}', [OrderAdminController::class, 'partialUpdate']);
    Route::delete('/orders_admin/{order_id}', [OrderAdminController::class, 'destroy']);

    // V2 Orders Admin (same controller, can be extended)
    Route::get('/v2/orders_admin', [OrderAdminController::class, 'index']);
    Route::post('/v2/orders_admin', [OrderAdminController::class, 'store']);
    Route::get('/v2/orders_admin/{order_id}', [OrderAdminController::class, 'show']);
    Route::put('/v2/orders_admin/{order_id}', [OrderAdminController::class, 'update']);
    Route::patch('/v2/orders_admin/{order_id}', [OrderAdminController::class, 'partialUpdate']);
    Route::delete('/v2/orders_admin/{order_id}', [OrderAdminController::class, 'destroy']);

    Route::get('/orders_by_city', [OrderAdminController::class, 'ordersByCity']);

    // ── Order Excel ──────────────────────────────────────────
    Route::get('/orders_excel_admin', [OrderExcelController::class, 'index']);
    Route::get('/orders_excel_admin/{id}', [OrderExcelController::class, 'show']);

    // ── Order Products ───────────────────────────────────────
    Route::get('/admin_order_products', [OrderProductController::class, 'index']);
    Route::post('/admin_order_products', [OrderProductController::class, 'store']);
    Route::get('/admin_order_products/{order_product_id}', [OrderProductController::class, 'show']);
    Route::put('/admin_order_products/{order_product_id}', [OrderProductController::class, 'update']);
    Route::patch('/admin_order_products/{order_product_id}', [OrderProductController::class, 'partialUpdate']);

    // ── Order Task History ───────────────────────────────────
    Route::get('/admin_order_tasks_history', [OrderTaskHistoryController::class, 'index']);
    Route::post('/admin_order_tasks_history', [OrderTaskHistoryController::class, 'store']);
    Route::get('/admin_order_tasks_history/{id}', [OrderTaskHistoryController::class, 'show']);
    Route::put('/admin_order_tasks_history/{id}', [OrderTaskHistoryController::class, 'update']);

    // ── Coupons Admin ────────────────────────────────────────
    Route::get('/admin_coupons', [CouponAdminController::class, 'index']);
    Route::post('/admin_coupons', [CouponAdminController::class, 'store']);
    Route::get('/admin_coupons/{coupon_id}', [CouponAdminController::class, 'show']);
    Route::put('/admin_coupons/{coupon_id}', [CouponAdminController::class, 'update']);
    Route::patch('/admin_coupons/{coupon_id}', [CouponAdminController::class, 'partialUpdate']);
    Route::delete('/admin_coupons/{coupon_id}', [CouponAdminController::class, 'destroy']);

    // ── Coupon History ───────────────────────────────────────
    Route::get('/coupon_history', [CouponHistoryController::class, 'index']);
    Route::post('/coupon_history', [CouponHistoryController::class, 'store']);
    Route::get('/coupon_history/{coupon_history_id}', [CouponHistoryController::class, 'show']);
    Route::put('/coupon_history/{coupon_history_id}', [CouponHistoryController::class, 'update']);
    Route::patch('/coupon_history/{coupon_history_id}', [CouponHistoryController::class, 'partialUpdate']);
    Route::delete('/coupon_history/{coupon_history_id}', [CouponHistoryController::class, 'destroy']);

    // ── Points Coupons ───────────────────────────────────────
    Route::get('/points_coupons', [PointsCouponController::class, 'index']);
    Route::post('/points_coupons', [PointsCouponController::class, 'store']);
    Route::get('/points_coupons/{id}', [PointsCouponController::class, 'show']);
    Route::put('/points_coupons/{id}', [PointsCouponController::class, 'update']);
    Route::patch('/points_coupons/{id}', [PointsCouponController::class, 'partialUpdate']);
    Route::delete('/points_coupons/{id}', [PointsCouponController::class, 'destroy']);

    // ── Banners Admin ────────────────────────────────────────
    Route::get('/banner_admin', [BannerAdminController::class, 'index']);
    Route::post('/banner_admin', [BannerAdminController::class, 'store']);
    Route::get('/banner_admin/{banner_image_id}', [BannerAdminController::class, 'show']);
    Route::put('/banner_admin/{banner_image_id}', [BannerAdminController::class, 'update']);
    Route::patch('/banner_admin/{banner_image_id}', [BannerAdminController::class, 'partialUpdate']);
    Route::delete('/banner_admin/{banner_image_id}', [BannerAdminController::class, 'destroy']);

    // ── Slides ───────────────────────────────────────────────
    Route::get('/slides', [SlideController::class, 'index']);
    Route::post('/slides', [SlideController::class, 'store']);
    Route::get('/slides/{slide_id}', [SlideController::class, 'show']);
    Route::put('/slides/{slide_id}', [SlideController::class, 'update']);
    Route::patch('/slides/{slide_id}', [SlideController::class, 'partialUpdate']);
    Route::delete('/slides/{slide_id}', [SlideController::class, 'destroy']);

    // ── Popups ───────────────────────────────────────────────
    Route::get('/popups', [PopupController::class, 'index']);
    Route::post('/popups', [PopupController::class, 'store']);
    Route::get('/popups/{id}', [PopupController::class, 'show']);
    Route::put('/popups/{id}', [PopupController::class, 'update']);
    Route::patch('/popups/{id}', [PopupController::class, 'partialUpdate']);
    Route::delete('/popups/{id}', [PopupController::class, 'destroy']);

    // ── Home Sections ────────────────────────────────────────
    Route::get('/home_section_admin', [HomeSectionController::class, 'index']);
    Route::post('/home_section_admin', [HomeSectionController::class, 'store']);
    Route::get('/home_section_admin/{id}', [HomeSectionController::class, 'show']);
    Route::put('/home_section_admin/{id}', [HomeSectionController::class, 'update']);
    Route::patch('/home_section_admin/{id}', [HomeSectionController::class, 'partialUpdate']);
    Route::delete('/home_section_admin/{id}', [HomeSectionController::class, 'destroy']);

    // ── Static Pages ─────────────────────────────────────────
    Route::get('/admin_static_pages', [StaticPageController::class, 'index']);
    Route::post('/admin_static_pages', [StaticPageController::class, 'store']);
    Route::get('/admin_static_pages/{id}', [StaticPageController::class, 'show']);
    Route::put('/admin_static_pages/{id}', [StaticPageController::class, 'update']);
    Route::patch('/admin_static_pages/{id}', [StaticPageController::class, 'partialUpdate']);
    Route::delete('/admin_static_pages/{id}', [StaticPageController::class, 'destroy']);

    // ── Notes Admin ──────────────────────────────────────────
    Route::get('/notes_admin', [NoteController::class, 'index']);
    Route::post('/notes_admin', [NoteController::class, 'store']);
    Route::get('/notes_admin/{important_notes_id}', [NoteController::class, 'show']);
    Route::put('/notes_admin/{important_notes_id}', [NoteController::class, 'update']);
    Route::patch('/notes_admin/{important_notes_id}', [NoteController::class, 'partialUpdate']);
    Route::delete('/notes_admin/{important_notes_id}', [NoteController::class, 'destroy']);

    // ── Short Home Videos ────────────────────────────────────
    Route::get('/short_home_videos', [ShortVideoController::class, 'index']);
    Route::post('/short_home_videos', [ShortVideoController::class, 'store']);
    Route::get('/short_home_videos/{id}', [ShortVideoController::class, 'show']);
    Route::put('/short_home_videos/{id}', [ShortVideoController::class, 'update']);
    Route::patch('/short_home_videos/{id}', [ShortVideoController::class, 'partialUpdate']);
    Route::delete('/short_home_videos/{id}', [ShortVideoController::class, 'destroy']);

    // ── Search Discover ──────────────────────────────────────
    Route::get('/search_discover_admin', [SearchDiscoverController::class, 'index']);
    Route::post('/search_discover_admin', [SearchDiscoverController::class, 'store']);
    Route::get('/search_discover_admin/{id}', [SearchDiscoverController::class, 'show']);
    Route::put('/search_discover_admin/{id}', [SearchDiscoverController::class, 'update']);
    Route::patch('/search_discover_admin/{id}', [SearchDiscoverController::class, 'partialUpdate']);
    Route::delete('/search_discover_admin/{id}', [SearchDiscoverController::class, 'destroy']);

    // ── Search Filters ───────────────────────────────────────
    Route::get('/search_filters_admin', [SearchFilterController::class, 'index']);
    Route::post('/search_filters_admin', [SearchFilterController::class, 'store']);
    Route::get('/search_filters_admin/{id}', [SearchFilterController::class, 'show']);
    Route::put('/search_filters_admin/{id}', [SearchFilterController::class, 'update']);
    Route::patch('/search_filters_admin/{id}', [SearchFilterController::class, 'partialUpdate']);
    Route::delete('/search_filters_admin/{id}', [SearchFilterController::class, 'destroy']);

    // ── Search Tags ──────────────────────────────────────────
    Route::get('/search_tags_admin', [SearchTagController::class, 'index']);
    Route::post('/search_tags_admin', [SearchTagController::class, 'store']);
    Route::get('/search_tags_admin/{id}', [SearchTagController::class, 'show']);
    Route::put('/search_tags_admin/{id}', [SearchTagController::class, 'update']);
    Route::patch('/search_tags_admin/{id}', [SearchTagController::class, 'partialUpdate']);
    Route::delete('/search_tags_admin/{id}', [SearchTagController::class, 'destroy']);

    // ── Firebase Notifications ───────────────────────────────
    Route::get('/firebase_notifications', [FirebaseNotificationController::class, 'index']);
    Route::post('/firebase_notifications', [FirebaseNotificationController::class, 'store']);
    Route::get('/firebase_notifications/{id}', [FirebaseNotificationController::class, 'show']);
    Route::put('/firebase_notifications/{id}', [FirebaseNotificationController::class, 'update']);
    Route::patch('/firebase_notifications/{id}', [FirebaseNotificationController::class, 'partialUpdate']);
    Route::delete('/firebase_notifications/{id}', [FirebaseNotificationController::class, 'destroy']);
    Route::post('/send-notification-to-all', [FirebaseNotificationController::class, 'sendToAll']);

    // ── Scheduled Notifications ──────────────────────────────
    Route::get('/scheduled_notifications', [ScheduledNotificationController::class, 'index']);
    Route::post('/scheduled_notifications', [ScheduledNotificationController::class, 'store']);
    Route::get('/scheduled_notifications/{id}', [ScheduledNotificationController::class, 'show']);
    Route::put('/scheduled_notifications/{id}', [ScheduledNotificationController::class, 'update']);
    Route::patch('/scheduled_notifications/{id}', [ScheduledNotificationController::class, 'partialUpdate']);
    Route::delete('/scheduled_notifications/{id}', [ScheduledNotificationController::class, 'destroy']);
    Route::post('/scheduled_notifications/{id}/approve', [ScheduledNotificationController::class, 'approve']);

    // ── FCM ──────────────────────────────────────────────────
    Route::get('/fcm/delivery-data', [FcmController::class, 'deliveryData']);

    // ── Delivery Costs ───────────────────────────────────────
    Route::get('/delivery_costs', [DeliveryCostController::class, 'index']);
    Route::post('/delivery_costs', [DeliveryCostController::class, 'store']);
    Route::get('/delivery_costs/{id}', [DeliveryCostController::class, 'show']);
    Route::put('/delivery_costs/{id}', [DeliveryCostController::class, 'update']);
    Route::patch('/delivery_costs/{id}', [DeliveryCostController::class, 'partialUpdate']);
    Route::delete('/delivery_costs/{id}', [DeliveryCostController::class, 'destroy']);

    // ── Delivery Service ─────────────────────────────────────
    Route::get('/delivery-service/get_areas', [DeliveryServiceController::class, 'getAreas']);
    Route::get('/delivery-service/get_cities', [DeliveryServiceController::class, 'getCities']);
    Route::post('/delivery-service/publish_shipment', [DeliveryServiceController::class, 'publishShipment']);

    // ── Audit Logs ───────────────────────────────────────────
    Route::get('/audit-logs', [AuditLogAdminController::class, 'index']);
    Route::get('/audit-logs/{id}', [AuditLogAdminController::class, 'show']);

    // ── Backend Logs ─────────────────────────────────────────
    Route::get('/backend-logs', [BackendLogController::class, 'index']);
    Route::get('/backend-logs/{id}', [BackendLogController::class, 'show']);

    // ── Surveys ──────────────────────────────────────────────
    Route::get('/admin_surveys', [SurveyController::class, 'index']);
    Route::post('/admin_surveys', [SurveyController::class, 'store']);
    Route::get('/admin_surveys/{id}', [SurveyController::class, 'show']);
    Route::put('/admin_surveys/{id}', [SurveyController::class, 'update']);
    Route::patch('/admin_surveys/{id}', [SurveyController::class, 'partialUpdate']);
    Route::delete('/admin_surveys/{id}', [SurveyController::class, 'destroy']);

    Route::get('/active-survey', [SurveyController::class, 'activeSurvey']);
    Route::put('/active-survey', [SurveyController::class, 'updateActiveSurvey']);

    // ── App Icons ────────────────────────────────────────────
    Route::get('/app_icons_admin', [AppIconController::class, 'index']);
    Route::post('/app_icons_admin', [AppIconController::class, 'store']);
    Route::get('/app_icons_admin/{id}', [AppIconController::class, 'show']);
    Route::put('/app_icons_admin/{id}', [AppIconController::class, 'update']);
    Route::patch('/app_icons_admin/{id}', [AppIconController::class, 'partialUpdate']);
    Route::delete('/app_icons_admin/{id}', [AppIconController::class, 'destroy']);

    // ── Currency Exchange ────────────────────────────────────
    Route::get('/currency_exchange', [CurrencyExchangeController::class, 'index']);
    Route::get('/currency_exchange/{id}', [CurrencyExchangeController::class, 'show']);

    // ── Temporary Disables ───────────────────────────────────
    Route::get('/temporary-disables', [TemporaryDisableController::class, 'index']);
    Route::get('/temporary-disables/{id}', [TemporaryDisableController::class, 'show']);
    Route::post('/temporary-disables/create', [TemporaryDisableController::class, 'createDisable']);
    Route::post('/temporary-disables/{id}/cancel', [TemporaryDisableController::class, 'cancel']);
    Route::get('/temporary-disables/{id}/products', [TemporaryDisableController::class, 'products']);

    // ── Discount Operations ──────────────────────────────────
    Route::post('/apply_random_discount', [DiscountOperationController::class, 'applyRandomDiscount']);
    Route::post('/assign-brand-products', [DiscountOperationController::class, 'assignBrandProducts']);

    // ── Customer Memberships ─────────────────────────────────
    Route::get('/customer-memberships', [CustomerMembershipController::class, 'index']);
    Route::post('/customer-memberships', [CustomerMembershipController::class, 'store']);
    Route::get('/customer-memberships/{id}', [CustomerMembershipController::class, 'show']);
    Route::put('/customer-memberships/{id}', [CustomerMembershipController::class, 'update']);
    Route::patch('/customer-memberships/{id}', [CustomerMembershipController::class, 'partialUpdate']);
    Route::delete('/customer-memberships/{id}', [CustomerMembershipController::class, 'destroy']);

    // ── User Ranks ───────────────────────────────────────────
    Route::get('/user-ranks', [UserRankController::class, 'index']);
    Route::post('/user-ranks', [UserRankController::class, 'store']);
    Route::get('/user-ranks/{id}', [UserRankController::class, 'show']);
    Route::put('/user-ranks/{id}', [UserRankController::class, 'update']);
    Route::patch('/user-ranks/{id}', [UserRankController::class, 'partialUpdate']);
    Route::delete('/user-ranks/{id}', [UserRankController::class, 'destroy']);

    // ── Referral Codes ───────────────────────────────────────
    Route::get('/referral_codes', [ReferralCodeController::class, 'index']);
    Route::post('/referral_codes', [ReferralCodeController::class, 'store']);
    Route::get('/referral_codes/{id}', [ReferralCodeController::class, 'show']);
    Route::put('/referral_codes/{id}', [ReferralCodeController::class, 'update']);
    Route::patch('/referral_codes/{id}', [ReferralCodeController::class, 'partialUpdate']);
    Route::delete('/referral_codes/{id}', [ReferralCodeController::class, 'destroy']);

    // ── User Carts ───────────────────────────────────────────
    Route::get('/users-cart', [UserCartController::class, 'index']);
    Route::post('/users-cart', [UserCartController::class, 'store']);
    Route::get('/users-cart/{cart_id}', [UserCartController::class, 'show']);
    Route::put('/users-cart/{cart_id}', [UserCartController::class, 'update']);
    Route::patch('/users-cart/{cart_id}', [UserCartController::class, 'partialUpdate']);
    Route::delete('/users-cart/{cart_id}', [UserCartController::class, 'destroy']);

    // ── User Recent Products ─────────────────────────────────
    Route::get('/user_recent_products', [UserRecentProductController::class, 'index']);
    Route::get('/user_recent_products/{id}', [UserRecentProductController::class, 'show']);

    // ── User Search History ──────────────────────────────────
    Route::get('/user_search_history', [UserSearchHistoryController::class, 'index']);
    Route::get('/user_search_history/{id}', [UserSearchHistoryController::class, 'show']);

    // ── Order Points History ─────────────────────────────────
    Route::get('/order_points_history', [OrderPointsHistoryController::class, 'index']);
    Route::post('/order_points_history', [OrderPointsHistoryController::class, 'store']);
    Route::get('/order_points_history/{id}', [OrderPointsHistoryController::class, 'show']);
    Route::put('/order_points_history/{id}', [OrderPointsHistoryController::class, 'update']);
    Route::patch('/order_points_history/{id}', [OrderPointsHistoryController::class, 'partialUpdate']);
    Route::delete('/order_points_history/{id}', [OrderPointsHistoryController::class, 'destroy']);

    // ── Misc Single Endpoints ────────────────────────────────
    Route::get('/dashboard_charts', [MiscController::class, 'dashboardCharts']);
    Route::get('/dashboard_statistics', [MiscController::class, 'dashboardStatistics']);
    Route::post('/recheck-users-points', [MiscController::class, 'recheckUsersPoints']);
    Route::get('/redirect_to_sms', [MiscController::class, 'redirectToSms']);
    Route::get('/old-product-modifications', [MiscController::class, 'oldProductModifications']);
    Route::get('/admin-chat/conversations', [MiscController::class, 'chatConversations']);
    Route::get('/content-types', [MiscController::class, 'contentTypes']);
    Route::get('/content-types/{id}', [MiscController::class, 'contentTypeDetail']);
});
