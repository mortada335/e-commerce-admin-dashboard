<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('banner_type', 50)->nullable()->after('is_active');
            $table->string('banner_type_id', 50)->nullable()->after('banner_type');
            $table->timestamp('event_date')->nullable()->after('banner_type_id');
            $table->timestamp('event_date_end')->nullable()->after('event_date');
            $table->string('event_title', 255)->nullable()->after('event_date_end');
        });

        Schema::create('banner_product', function (Blueprint $table) {
            $table->foreignId('banner_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->primary(['banner_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banner_product');

        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn([
                'banner_type', 'banner_type_id',
                'event_date', 'event_date_end', 'event_title',
            ]);
        });
    }
};
