<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductImage>
 */
class ProductImageFactory extends Factory
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
            'image_path' => 'https://placehold.co/'
            .fake()->numberBetween(300, 800).'x' // Width random between 300 and 800
            .fake()->numberBetween(200, 600).'/' // Height random between 200 and 600
            .fake()->safeColorName().'/' // Background color
            .fake()->safeColorName(). // Text color
            '.png?text='.fake()->word(), // Random text for the image (optional)

            'alt_text' => $this->faker->word(),
            'is_primary' => $this->faker->boolean(),
            // 'sort_order' => $this->faker->randomNumber(),
        ];
    }
}
