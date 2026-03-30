<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('delivery_costs', 12, 4)->default(0)->after('shipping_amount');
            $table->decimal('coupon_discount_value', 10, 2)->default(0)->after('discount_amount');
            $table->string('payment_method', 128)->nullable()->after('payment_status');
            $table->string('device_type', 50)->nullable()->after('tracking_number');
            $table->boolean('is_gift')->default(false)->after('device_type');
            $table->text('gift_comment')->nullable()->after('is_gift');
            $table->string('shipping_address_2')->nullable()->after('shipping_address');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_costs', 'coupon_discount_value', 'payment_method',
                'device_type', 'is_gift', 'gift_comment', 'shipping_address_2',
            ]);
        });
    }
};
