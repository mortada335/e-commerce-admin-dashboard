<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── User Logins ──────────────────────────────────────
        Schema::create('user_logins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('logged_in_at')->useCurrent();
            $table->timestamps();
            $table->index('user_id');
        });

        // ── Addresses ────────────────────────────────────────
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('firstname', 32)->default('');
            $table->string('lastname', 32)->default('');
            $table->string('company', 40)->nullable();
            $table->text('address_1')->default('');
            $table->text('address_2')->nullable();
            $table->string('city', 128)->default('');
            $table->string('postcode', 10)->default('');
            $table->integer('country_id')->default(0);
            $table->integer('zone_id')->default(0);
            $table->string('custom_field')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('address_type', 20)->nullable(); // home, office, etc.
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
            $table->index('customer_id');
        });

        // ── Attribute Groups ─────────────────────────────────
        Schema::create('attribute_groups', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('attribute_group_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_group_id')->constrained()->cascadeOnDelete();
            $table->integer('language_id')->default(1);
            $table->string('name');
            $table->timestamps();
            $table->unique(['attribute_group_id', 'language_id']);
        });

        // ── Attribute Descriptions ───────────────────────────
        Schema::create('attribute_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->integer('language_id')->default(1);
            $table->string('name');
            $table->timestamps();
            $table->unique(['attribute_id', 'language_id']);
        });

        // ── Product Attributes (admin) ───────────────────────
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('attribute_id');
            $table->integer('language_id')->default(1);
            $table->text('text')->nullable();
            $table->timestamps();
            $table->index(['product_id', 'attribute_id']);
        });

        // ── Option Types ─────────────────────────────────────
        Schema::create('option_types', function (Blueprint $table) {
            $table->id();
            $table->string('type', 32); // select, radio, checkbox, etc.
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('option_type_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('option_type_id')->constrained('option_types')->cascadeOnDelete();
            $table->integer('language_id')->default(1);
            $table->string('name');
            $table->timestamps();
            $table->unique(['option_type_id', 'language_id']);
        });

        // ── Option Type Values ───────────────────────────────
        Schema::create('option_type_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('option_type_id')->constrained('option_types')->cascadeOnDelete();
            $table->string('image')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('option_type_value_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('option_type_value_id')->constrained('option_type_values')->cascadeOnDelete();
            $table->integer('language_id')->default(1);
            $table->string('name');
            $table->timestamps();
            $table->unique(['option_type_value_id', 'language_id'], 'otvd_unique');
        });

        // ── Product Option Values ────────────────────────────
        Schema::create('product_option_values', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('option_type_id');
            $table->unsignedBigInteger('option_type_value_id');
            $table->integer('quantity')->default(0);
            $table->boolean('subtract')->default(true);
            $table->decimal('price', 15, 4)->default(0);
            $table->string('price_prefix', 1)->default('+');
            $table->decimal('weight', 15, 4)->default(0);
            $table->string('weight_prefix', 1)->default('+');
            $table->timestamps();
            $table->index('product_id');
        });

        // ── Product Videos ───────────────────────────────────
        Schema::create('product_videos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('video_url');
            $table->string('thumbnail')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->index('product_id');
        });

        // ── Category Descriptions ────────────────────────────
        Schema::create('category_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->integer('language_id')->default(1);
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keyword')->nullable();
            $table->timestamps();
            $table->unique(['category_id', 'language_id']);
        });

        // ── Order Products (admin-level) ─────────────────────
        Schema::create('order_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id');
            $table->string('name');
            $table->string('model', 64)->default('');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 15, 4)->default(0);
            $table->decimal('total', 15, 4)->default(0);
            $table->decimal('tax', 15, 4)->default(0);
            $table->integer('reward')->default(0);
            $table->timestamps();
            $table->index('order_id');
        });

        // ── Order Task History ───────────────────────────────
        Schema::create('order_task_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('task_id')->nullable();
            $table->string('task_name')->nullable();
            $table->string('status', 20)->default('pending');
            $table->json('result')->nullable();
            $table->timestamps();
            $table->index('order_id');
        });

        // ── Coupon Histories ─────────────────────────────────
        Schema::create('coupon_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('coupon_id');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->decimal('amount', 15, 4)->default(0);
            $table->timestamps();
            $table->index('coupon_id');
        });

        // ── Points Coupons ───────────────────────────────────
        Schema::create('points_coupons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique();
            $table->integer('points_required')->default(0);
            $table->decimal('discount', 15, 4)->default(0);
            $table->string('type', 1)->default('P'); // P=percentage, F=fixed
            $table->integer('uses_total')->default(0);
            $table->integer('uses_customer')->default(0);
            $table->integer('status')->default(1);
            $table->timestamp('date_start')->nullable();
            $table->timestamp('date_end')->nullable();
            $table->timestamps();
        });

        // ── Slides ───────────────────────────────────────────
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('link')->nullable();
            $table->string('image');
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->integer('language_id')->default(1);
            $table->timestamps();
        });

        // ── Popups ───────────────────────────────────────────
        Schema::create('popups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type', 20)->default('image'); // image, html, url
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->string('link')->nullable();
            $table->integer('status')->default(1);
            $table->integer('sort_order')->default(0);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->integer('display_frequency')->default(0);
            $table->json('target_pages')->nullable();
            $table->timestamps();
        });

        // ── Home Sections ────────────────────────────────────
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('title_ar')->nullable();
            $table->string('section_type', 50); // banner, products, categories, brands, etc.
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->json('config')->nullable(); // flexible config
            $table->json('items')->nullable(); // product_ids, category_ids, etc.
            $table->string('background_color', 20)->nullable();
            $table->string('style', 20)->default('default');
            $table->timestamps();
        });

        // ── Static Pages ─────────────────────────────────────
        Schema::create('static_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->integer('language_id')->default(1);
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();
        });

        // ── Important Notes ──────────────────────────────────
        Schema::create('important_notes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('status')->default(1);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamps();
        });

        // ── Short Videos ─────────────────────────────────────
        Schema::create('short_videos', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('video_url');
            $table->string('thumbnail')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        // ── Search Discovers ─────────────────────────────────
        Schema::create('search_discovers', function (Blueprint $table) {
            $table->id();
            $table->string('keyword');
            $table->string('image')->nullable();
            $table->string('link')->nullable();
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->integer('language_id')->default(1);
            $table->timestamps();
        });

        // ── Search Filters ───────────────────────────────────
        Schema::create('search_filters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('filter_type', 30); // category, brand, price_range, attribute
            $table->json('config')->nullable();
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->integer('language_id')->default(1);
            $table->timestamps();
        });

        // ── Search Tags ──────────────────────────────────────
        Schema::create('search_tags', function (Blueprint $table) {
            $table->id();
            $table->string('tag');
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->integer('language_id')->default(1);
            $table->timestamps();
        });

        // ── Firebase Notifications ───────────────────────────
        Schema::create('firebase_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_ar')->nullable();
            $table->text('body')->nullable();
            $table->text('body_ar')->nullable();
            $table->string('image')->nullable();
            $table->string('link')->nullable();
            $table->string('topic')->nullable();
            $table->json('target_users')->nullable();
            $table->integer('status')->default(0); // 0=draft, 1=sent
            $table->timestamp('sent_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // ── Scheduled Notifications ──────────────────────────
        Schema::create('scheduled_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_ar')->nullable();
            $table->text('body')->nullable();
            $table->text('body_ar')->nullable();
            $table->string('image')->nullable();
            $table->string('link')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->integer('status')->default(0); // 0=pending, 1=sent, 2=cancelled
            $table->json('target')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // ── Delivery Costs ───────────────────────────────────
        Schema::create('delivery_costs', function (Blueprint $table) {
            $table->id();
            $table->string('city');
            $table->string('zone', 20)->default('others');
            $table->decimal('cost', 15, 4)->default(0);
            $table->decimal('free_delivery_threshold', 15, 4)->nullable();
            $table->integer('estimated_days')->default(3);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        // ── Audit Logs ───────────────────────────────────────
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('username')->nullable();
            $table->integer('action')->default(0); // 0=create,1=update,2=delete,3=access
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('url')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
        });

        // ── Backend Logs ─────────────────────────────────────
        Schema::create('backend_logs', function (Blueprint $table) {
            $table->id();
            $table->string('level', 20)->default('info');
            $table->text('message');
            $table->json('context')->nullable();
            $table->string('channel', 50)->nullable();
            $table->timestamps();
            $table->index('level');
        });

        // ── Surveys ──────────────────────────────────────────
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('questions')->nullable();
            $table->integer('status')->default(1);
            $table->boolean('is_active')->default(false);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamps();
        });

        // ── App Icons ────────────────────────────────────────
        Schema::create('app_icons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon_url');
            $table->string('link')->nullable();
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        // ── Currency Exchanges ───────────────────────────────
        Schema::create('currency_exchanges', function (Blueprint $table) {
            $table->id();
            $table->string('currency_from', 5)->default('USD');
            $table->string('currency_to', 5)->default('IQD');
            $table->decimal('rate', 15, 6)->default(1);
            $table->timestamps();
        });

        // ── Temporary Disables ───────────────────────────────
        Schema::create('temporary_disables', function (Blueprint $table) {
            $table->id();
            $table->string('reason')->nullable();
            $table->json('product_ids')->nullable();
            $table->json('category_ids')->nullable();
            $table->timestamp('disable_from')->nullable();
            $table->timestamp('disable_until')->nullable();
            $table->boolean('is_cancelled')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // ── Customer Memberships ─────────────────────────────
        Schema::create('customer_memberships', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('membership_type', 50)->default('standard');
            $table->integer('points')->default(0);
            $table->decimal('total_spent', 15, 4)->default(0);
            $table->integer('total_orders')->default(0);
            $table->integer('status')->default(1);
            $table->timestamp('member_since')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->json('benefits')->nullable();
            $table->timestamps();
            $table->index('customer_id');
        });

        // ── User Ranks ───────────────────────────────────────
        Schema::create('user_ranks', function (Blueprint $table) {
            $table->id();
            $table->string('rank_name');
            $table->integer('min_points')->default(0);
            $table->integer('max_points')->default(0);
            $table->timestamps();
        });

        // ── Referral Codes ───────────────────────────────────
        Schema::create('referral_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('code', 20)->unique();
            $table->integer('uses_count')->default(0);
            $table->integer('max_uses')->nullable();
            $table->decimal('reward_amount', 15, 4)->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();
            $table->index('user_id');
        });

        // ── User Carts ───────────────────────────────────────
        Schema::create('user_carts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity')->default(1);
            $table->json('options')->nullable();
            $table->timestamps();
            $table->index('customer_id');
        });

        // ── User Recent Products ─────────────────────────────
        Schema::create('user_recent_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->timestamp('viewed_at')->useCurrent();
            $table->timestamps();
            $table->index('user_id');
        });

        // ── User Searches ────────────────────────────────────
        Schema::create('user_searches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('search_param');
            $table->timestamp('last_searched')->useCurrent();
            $table->timestamps();
            $table->index('user_id');
        });

        // ── Order Points History ─────────────────────────────
        Schema::create('order_points_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('customer_id');
            $table->integer('points')->default(0);
            $table->string('description')->nullable();
            $table->timestamps();
            $table->index(['order_id', 'customer_id']);
        });
    }

    public function down(): void
    {
        $tables = [
            'order_points_histories', 'user_searches', 'user_recent_products', 'user_carts',
            'referral_codes', 'user_ranks', 'customer_memberships', 'temporary_disables',
            'currency_exchanges', 'app_icons', 'surveys', 'backend_logs', 'audit_logs',
            'delivery_costs', 'scheduled_notifications', 'firebase_notifications',
            'search_tags', 'search_filters', 'search_discovers', 'short_videos',
            'important_notes', 'static_pages', 'home_sections', 'popups', 'slides',
            'points_coupons', 'coupon_histories', 'order_task_histories', 'order_products',
            'category_descriptions', 'product_videos', 'product_option_values',
            'option_type_value_descriptions', 'option_type_values', 'option_type_descriptions',
            'option_types', 'product_attributes', 'attribute_descriptions',
            'attribute_group_descriptions', 'attribute_groups', 'addresses', 'user_logins',
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
};
