<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', [
                'pending', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'
            ])->default('pending');
            $table->enum('payment_status', [
                'pending', 'paid', 'failed', 'refunded', 'partial'
            ])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->text('notes')->nullable();
            // Shipping address snapshot
            $table->string('shipping_name')->nullable();
            $table->string('shipping_address')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state')->nullable();
            $table->string('shipping_country')->nullable();
            $table->string('shipping_zip')->nullable();
            $table->string('shipping_phone')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('order_number');
            $table->index(['status', 'payment_status']);
            $table->index('customer_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
