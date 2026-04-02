<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles & Permissions
        $permissions = [
            'view dashboard', 'view products', 'manage products',
            'view orders', 'manage orders', 'view customers', 'manage customers',
            'view categories', 'manage categories', 'view brands', 'manage brands',
            'view coupons', 'manage coupons',
            'view inventory', 'manage inventory', 'view settings', 'manage settings',
            'view payments',
            'manage banners', 'manage reviews',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

        $admin->syncPermissions(Permission::all());
        $manager->syncPermissions([
            'view dashboard', 'view products', 'manage products',
            'view orders', 'manage orders', 'view customers',
            'view categories', 'view brands', 'view inventory', 'view payments',
        ]);
        $staff->syncPermissions([
            'view dashboard', 'view products', 'view orders',
            'view customers', 'view categories', 'view brands', 'view inventory',
        ]);

        // Admin User
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => Hash::make('password'), 'is_active' => true]
        );
        $adminUser->assignRole('admin');

        $managerUser = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            ['name' => 'Store Manager', 'password' => Hash::make('password'), 'is_active' => true]
        );
        $managerUser->assignRole('manager');

        $staffUser = User::firstOrCreate(
            ['email' => 'staff@example.com'],
            ['name' => 'Staff Member', 'password' => Hash::make('password'), 'is_active' => true]
        );
        $staffUser->assignRole('staff');

        // Categories
        $electronics = Category::firstOrCreate(['slug' => 'electronics'], ['name' => 'Electronics', 'description' => 'Electronic gadgets and devices', 'is_active' => true]);
        $phones = Category::firstOrCreate(['slug' => 'smartphones'], ['name' => 'Smartphones', 'parent_id' => $electronics->id, 'is_active' => true]);
        $laptops = Category::firstOrCreate(['slug' => 'laptops'], ['name' => 'Laptops', 'parent_id' => $electronics->id, 'is_active' => true]);
        $clothing = Category::firstOrCreate(['slug' => 'clothing'], ['name' => 'Clothing', 'description' => 'Fashion and apparel', 'is_active' => true]);
        $books = Category::firstOrCreate(['slug' => 'books'], ['name' => 'Books', 'is_active' => true]);

        // Products
        $products = [
            ['name' => 'iPhone 15 Pro', 'sku' => 'IPH-15-PRO', 'price' => 999.99, 'stock_quantity' => 50, 'category_id' => $phones->id],
            ['name' => 'Samsung Galaxy S24', 'sku' => 'SAM-S24', 'price' => 849.99, 'discount_price' => 799.99, 'stock_quantity' => 35, 'category_id' => $phones->id],
            ['name' => 'MacBook Pro 14"', 'sku' => 'MBP-14-M3', 'price' => 1999.99, 'stock_quantity' => 20, 'category_id' => $laptops->id],
            ['name' => 'Dell XPS 15', 'sku' => 'DELL-XPS15', 'price' => 1499.99, 'discount_price' => 1299.99, 'stock_quantity' => 15, 'category_id' => $laptops->id],
            ['name' => 'Nike Air Max 270', 'sku' => 'NIKE-AM270', 'price' => 149.99, 'stock_quantity' => 8, 'low_stock_threshold' => 10, 'category_id' => $clothing->id],
            ['name' => 'Clean Code (Book)', 'sku' => 'BOOK-CC-001', 'price' => 34.99, 'stock_quantity' => 5, 'low_stock_threshold' => 10, 'category_id' => $books->id],
        ];

        $createdProducts = [];
        foreach ($products as $p) {
            $p['status'] = 'active';
            $p['description'] = "Description for {$p['name']}";
            $p['low_stock_threshold'] = $p['low_stock_threshold'] ?? 10;
            $createdProducts[] = Product::firstOrCreate(['sku' => $p['sku']], $p);
        }

        // Customers
        $customerData = [
            ['first_name' => 'John', 'last_name' => 'Doe', 'email' => 'john@example.com', 'phone' => '+1-555-0101', 'city' => 'New York', 'country' => 'US'],
            ['first_name' => 'Jane', 'last_name' => 'Smith', 'email' => 'jane@example.com', 'phone' => '+1-555-0102', 'city' => 'Los Angeles', 'country' => 'US'],
            ['first_name' => 'Ahmed', 'last_name' => 'Hassan', 'email' => 'ahmed@example.com', 'phone' => '+966-50-0003', 'city' => 'Riyadh', 'country' => 'SA'],
            ['first_name' => 'Maria', 'last_name' => 'Garcia', 'email' => 'maria@example.com', 'phone' => '+34-600-000004', 'city' => 'Madrid', 'country' => 'ES'],
        ];

        $customers = [];
        foreach ($customerData as $c) {
            $c['is_active'] = true;
            $customers[] = Customer::firstOrCreate(['email' => $c['email']], $c);
        }

        // Coupons
        Coupon::firstOrCreate(['code' => 'WELCOME10'], [
            'description' => '10% off for new customers', 'type' => 'percentage', 'value' => 10,
            'is_active' => true, 'expires_at' => now()->addYear(),
        ]);
        Coupon::firstOrCreate(['code' => 'SAVE50'], [
            'description' => '$50 off orders over $500', 'type' => 'fixed', 'value' => 50,
            'min_order_amount' => 500, 'is_active' => true, 'expires_at' => now()->addMonths(6),
        ]);

        // Orders with items
        $statusOptions = ['pending', 'processing', 'shipped', 'delivered'];
        $paymentStatusOptions = ['pending', 'paid', 'paid', 'paid'];

        foreach ($customers as $customer) {
            for ($i = 0; $i < 3; $i++) {
                $product = $createdProducts[array_rand($createdProducts)];
                $qty = rand(1, 3);
                $subtotal = $product->price * $qty;
                $statusIdx = array_rand($statusOptions);

                $order = Order::create([
                    'customer_id'    => $customer->id,
                    'status'         => $statusOptions[$statusIdx],
                    'payment_status' => $paymentStatusOptions[$statusIdx],
                    'subtotal'       => $subtotal,
                    'tax_amount'     => round($subtotal * 0.08, 2),
                    'shipping_amount'=> 9.99,
                    'total'          => round($subtotal + ($subtotal * 0.08) + 9.99, 2),
                    'shipping_name'  => $customer->full_name,
                    'shipping_city'  => $customer->city,
                    'shipping_country' => $customer->country,
                    'currency'       => 'USD',
                    'created_at'     => now()->subDays(rand(1, 90)),
                ]);

                OrderItem::create([
                    'order_id'       => $order->id,
                    'product_id'     => $product->id,
                    'product_name'   => $product->name,
                    'product_sku'    => $product->sku,
                    'unit_price'     => $product->price,
                    'quantity'       => $qty,
                    'subtotal'       => $subtotal,
                ]);

                if ($paymentStatusOptions[$statusIdx] === 'paid') {
                    Payment::create([
                        'order_id' => $order->id,
                        'method'   => 'stripe',
                        'status'   => 'paid',
                        'amount'   => $order->total,
                        'currency' => 'USD',
                        'paid_at'  => $order->created_at,
                        'transaction_id' => 'txn_' . uniqid(),
                    ]);
                }
            }
        }

        // Default Settings
        $defaultSettings = [
            ['key' => 'store_name', 'value' => 'My E-Commerce Store', 'group' => 'store', 'label' => 'Store Name'],
            ['key' => 'store_email', 'value' => 'hello@store.com', 'group' => 'store', 'label' => 'Store Email'],
            ['key' => 'currency', 'value' => 'USD', 'group' => 'currency', 'label' => 'Currency'],
            ['key' => 'currency_symbol', 'value' => '$', 'group' => 'currency', 'label' => 'Currency Symbol'],
            ['key' => 'tax_rate', 'value' => '8', 'group' => 'tax', 'type' => 'integer', 'label' => 'Tax Rate (%)'],
            ['key' => 'free_shipping_threshold', 'value' => '100', 'group' => 'shipping', 'type' => 'integer', 'label' => 'Free Shipping Over ($)'],
            ['key' => 'flat_shipping_rate', 'value' => '9.99', 'group' => 'shipping', 'label' => 'Flat Rate Shipping ($)'],
        ];

        foreach ($defaultSettings as $s) {
            Setting::firstOrCreate(['key' => $s['key']], array_merge(['type' => 'string', 'group' => 'general'], $s));
        }

        $this->command->info('✅ Database seeded successfully!');
    }
}
