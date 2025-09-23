<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::inRandomOrder()->first()->id ?? null,
            'product_id' => Product::inRandomOrder()->first()->id ?? null,
            'product_unit_id' => ProductUnit::inRandomOrder()->first()->id ?? null,
            'product_name' => $this->faker->word(),
            'unit_label' => $this->faker->word(),
            'product_price' => $this->faker->randomFloat(2, 100, 1000),
            'quantity' => $this->faker->numberBetween(1, 10),
            'subtotal' => $this->faker->randomFloat(2, 100, 1000),
        ];
    }
}
