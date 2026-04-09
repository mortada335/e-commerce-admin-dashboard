<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Performance indexes recommended in PRD §21.
     * All indexes are additive — no existing data or columns are modified.
     */
    public function up(): void
    {
        // Orders: dashboard filtering by status + date range
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'idx_orders_status_created');
            $table->index(['payment_status', 'created_at'], 'idx_orders_payment_created');
            $table->index(['customer_id', 'created_at'], 'idx_orders_customer_created');
        });

        // Products: low-stock alerts and category-filtered lists
        Schema::table('products', function (Blueprint $table) {
            $table->index(['status', 'stock_quantity', 'low_stock_threshold'], 'idx_products_status_stock');
            $table->index(['category_id', 'status'], 'idx_products_category_status');
        });

        // Order items: join lookups for top products / revenue by category
        Schema::table('order_items', function (Blueprint $table) {
            $table->index(['order_id', 'product_id'], 'idx_order_items_order_product');
        });

        // Activity logs: audit trail lookups by model
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index(['model_type', 'model_id', 'created_at'], 'idx_activity_logs_model');
        });

        // pg_trgm extension for customer ILIKE search performance
        // This extension ships with PostgreSQL by default
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_customers_email_trgm ON customers USING gin (email gin_trgm_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_customers_name_trgm ON customers USING gin (first_name gin_trgm_ops, last_name gin_trgm_ops)');
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_status_created');
            $table->dropIndex('idx_orders_payment_created');
            $table->dropIndex('idx_orders_customer_created');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_status_stock');
            $table->dropIndex('idx_products_category_status');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('idx_order_items_order_product');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex('idx_activity_logs_model');
        });

        DB::statement('DROP INDEX IF EXISTS idx_customers_email_trgm');
        DB::statement('DROP INDEX IF EXISTS idx_customers_name_trgm');
    }
};
