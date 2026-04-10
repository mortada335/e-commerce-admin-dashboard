<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Customers
        for ($i = 0; $i < 10; $i++) {
            DB::table('customers')->insert([
                'full_name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'address_line1' => $faker->streetAddress,
                'address_line2' => $faker->secondaryAddress,
                'city' => $faker->city,
                'state' => $faker->state,
                'country' => $faker->country,
                'zip' => $faker->postcode,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Products
        for ($i = 0; $i < 20; $i++) {
            DB::table('products')->insert([
                'name' => $faker->words(3, true),
                'sku' => strtoupper($faker->bothify('???-#####')),
                'price' => $faker->randomFloat(2, 5, 500),
                'description' => $faker->sentence,
                'stock' => $faker->numberBetween(0, 100),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Orders
        for ($i = 0; $i < 15; $i++) {
            $customerId = DB::table('customers')->inRandomOrder()->first()->id;
            $orderNumber = strtoupper($faker->bothify('ORD-#####'));
            $status = $faker->randomElement(['pending', 'processing', 'completed', 'canceled']);
            $total = $faker->randomFloat(2, 20, 2000);
            $createdAt = $faker->dateTimeBetween('-30 days', 'now');

            $orderId = DB::table('orders')->insertGetId([
                'order_number' => $orderNumber,
                'customer_id' => $customerId,
                'status' => $status,
                'total' => $total,
                'currency' => 'USD',
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Attach random products to order items
            $itemsCount = $faker->numberBetween(1, 5);
            for ($j = 0; $j < $itemsCount; $j++) {
                $product = DB::table('products')->inRandomOrder()->first();
                $quantity = $faker->numberBetween(1, 3);
                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $product->price,
                    'quantity' => $quantity,
                    'subtotal' => $product->price * $quantity,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
?>
