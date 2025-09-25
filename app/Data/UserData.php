<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class UserData extends Data
{
    // 'name',
    //     'role', // 'admin', 'employee', 'customer'
    //     'email',
    //     'password',
    //     'products',
    //     'orders',
    public function __construct(
        public int $id,
        public string $name,
        public string $role,
        public string $email,
        public ?string $email_verified_at = null,
        public ?string $created_at = null,
        public ?string $updated_at = null,
        /** @var ProductData[]|null */
        public ?array $products = null,
        /** @var OrderData[]|null */
        public ?array $orders = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            name: $model->name,
            role: $model->role,
            email: $model->email,
            email_verified_at: $model->email_verified_at?->toDateTimeString(),
            created_at: $model->created_at?->toDateTimeString(),
            updated_at: $model->updated_at?->toDateTimeString(),
            products: $model->products?->map(fn ($prod) => ProductData::from($prod))?->values()?->all(),
            orders: $model->orders?->map(fn ($order) => OrderData::from($order))?->values()?->all(),
        );
    }
}
