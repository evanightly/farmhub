<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductUnit>
 */
class ProductUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id ?? null,
            'unit_type' => $this->faker->randomElement(['kg', 'karung', 'ton', 'pieces', 'ikat']),
            'unit_label' => $this->faker->word(), // 'Kilogram', 'Karung (25kg)', 'Ton', 'Buah', 'Ikat'
            'price_per_unit' => $this->faker->randomFloat(2, 100, 1000),
            'stock_quantity' => $this->faker->randomFloat(2, 0, 100),
            'is_active' => $this->faker->boolean(),
            'sort_order' => $this->faker->randomNumber(),
            'notes' => $this->faker->sentence(),
        ];
    }
}
