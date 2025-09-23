<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'order_id' => Order::inRandomOrder(),
        'account_id' => Account::inRandomOrder(),
        'payment_method' => $this->faker->randomElement(['bank_transfer', 'e_wallet', 'cash']),
        'amount' => $this->faker->randomFloat(2, 100, 1000),
        'proof_image_path' => $this->faker->imageUrl(),
        'payment_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
        'verified_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        'verified_by' => null, // bisa diisi dengan user id yang memverifikasi
        'notes' => $this->faker->text(),
        // 'reference_number' => $this->faker->uuid(),
        ];
    }
}
