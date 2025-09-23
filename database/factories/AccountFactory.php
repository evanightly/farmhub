<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_name' => $this->faker->randomElement(['BRI', 'BNI', 'Mandiri', 'Dana', 'GoPay']),
            'owner_name' => $this->faker->name(), // nama pemilik rekening
            'account_no' => $this->faker->bankAccountNumber(), // nomor rekening
            'account_type' => $this->faker->randomElement(['bank_transfer', 'e_wallet', 'cash']), // 'bank_transfer', 'e_wallet', 'cash'
            'account_logo' => $this->faker->imageUrl(), // path to logo image
            'instructions' => $this->faker->text(), // instruksi pembayaran khusus
            // 'is_active' => $this->faker->boolean(), // enable/disable account
            // 'sort_order' => $this->faker->randomNumber(), // urutan tampilan
            // 'metadata' => $this->faker->text(), // JSON untuk info tambahan (SWIFT code, branch, etc)
        ];
    }
}
