<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->text('address_line1')->nullable()->change();
            $table->text('address_line2')->nullable()->change();
            $table->text('city')->nullable()->change();
            $table->text('state')->nullable()->change();
            $table->text('country')->nullable()->change();
            $table->text('zip')->nullable()->change();
        });

        // Encrypt existing data
        DB::table('customers')->orderBy('id')->chunk(500, function ($customers) {
            foreach ($customers as $customer) {
                DB::table('customers')->where('id', $customer->id)->update([
                    'address_line1' => $customer->address_line1 ? Crypt::encryptString($customer->address_line1) : null,
                    'address_line2' => $customer->address_line2 ? Crypt::encryptString($customer->address_line2) : null,
                    'city'          => $customer->city ? Crypt::encryptString($customer->city) : null,
                    'state'         => $customer->state ? Crypt::encryptString($customer->state) : null,
                    'country'       => $customer->country ? Crypt::encryptString($customer->country) : null,
                    'zip'           => $customer->zip ? Crypt::encryptString($customer->zip) : null,
                ]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Decrypt
        DB::table('customers')->orderBy('id')->chunk(500, function ($customers) {
            foreach ($customers as $customer) {
                try {
                    DB::table('customers')->where('id', $customer->id)->update([
                        'address_line1' => $customer->address_line1 ? Crypt::decryptString($customer->address_line1) : null,
                        'address_line2' => $customer->address_line2 ? Crypt::decryptString($customer->address_line2) : null,
                        'city'          => $customer->city ? Crypt::decryptString($customer->city) : null,
                        'state'         => $customer->state ? Crypt::decryptString($customer->state) : null,
                        'country'       => $customer->country ? Crypt::decryptString($customer->country) : null,
                        'zip'           => $customer->zip ? Crypt::decryptString($customer->zip) : null,
                    ]);
                } catch (\Exception $e) {
                    // Ignore failures
                }
            }
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('address_line1')->nullable()->change();
            $table->string('address_line2')->nullable()->change();
            $table->string('city')->nullable()->change();
            $table->string('state')->nullable()->change();
            $table->string('country')->nullable()->default('US')->change();
            $table->string('zip')->nullable()->change();
        });
    }
};
