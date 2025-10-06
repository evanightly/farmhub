<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductUnit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DashboardChartSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // Create some sample orders for the last 30 days to populate charts
        $products = Product::all();
        $productUnits = ProductUnit::all();
        $statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
        $paymentStatuses = ['unpaid', 'paid', 'verified'];

        if ($products->isEmpty()) {
            $this->command->info('No products found. Please run product seeder first.');

            return;
        }

        if ($productUnits->isEmpty()) {
            $this->command->info('No product units found. Please run product unit seeder first.');

            return;
        }

        for ($i = 30; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $ordersForDay = rand(0, 8); // 0-8 orders per day

            for ($j = 0; $j < $ordersForDay; $j++) {
                $order = Order::create([
                    'customer_name' => 'Customer ' . rand(1, 100),
                    'customer_email' => 'customer' . rand(1, 100) . '@example.com',
                    'customer_phone' => '08' . rand(1000000000, 9999999999),
                    'shipping_address' => 'Alamat ' . rand(1, 100),
                    'status' => $statuses[array_rand($statuses)],
                    'payment_status' => $paymentStatuses[array_rand($paymentStatuses)],
                    'total_amount' => rand(50000, 500000),
                    'notes' => 'Sample order for testing',
                    'access_token' => Str::random(32),
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                // Add order items
                $numItems = rand(1, 3);
                for ($k = 0; $k < $numItems; $k++) {
                    $product = $products->random();
                    $productUnit = $productUnits->random();
                    $quantity = rand(1, 5);
                    $price = rand(10000, 100000);

                    $order->order_items()->create([
                        'product_id' => $product->id,
                        'product_unit_id' => $productUnit->id,
                        'product_name' => $product->name,
                        'unit_label' => $productUnit->unit_label,
                        'quantity' => $quantity,
                        'product_price' => $price,
                        'subtotal' => $quantity * $price,
                    ]);
                }

                // Update total amount based on order items
                $order->update([
                    'total_amount' => $order->order_items()->sum('subtotal'),
                ]);
            }
        }

        $this->command->info('Created sample orders for dashboard charts.');
    }
}
