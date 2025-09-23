<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'harvest_date' => $this->faker->date(),
            'expiry_date' => $this->faker->date(),
            'is_active' => $this->faker->boolean(),
            'created_by' => User::inRandomOrder()->first()->id ?? null,
            // 'meta_data' => $this->faker->words(3, true),
        ];
    }
}
