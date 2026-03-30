<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('max_cart_quantity')->default(99)->after('low_stock_threshold');
            $table->boolean('is_new')->default(false)->after('is_featured');
            $table->boolean('is_enabled')->default(true)->after('is_new');
            $table->timestamp('discount_start_date')->nullable()->after('discount_price');
            $table->timestamp('discount_expiry_date')->nullable()->after('discount_start_date');
            $table->integer('discount_remaining_qty')->nullable()->after('discount_expiry_date');
            $table->text('notes')->nullable()->after('meta');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'max_cart_quantity', 'is_new', 'is_enabled',
                'discount_start_date', 'discount_expiry_date',
                'discount_remaining_qty', 'notes',
            ]);
        });
    }
};
