<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class UserData extends Data {
    public function __construct(
        public int $id,
        public string $name,
        public string $role,
        public string $email,
        public ?string $email_verified_at = null,
        public ?string $created_at = null,
        public ?string $updated_at = null,
        public ?int $product_count = null,
        public ?int $order_count = null,
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
            // counts: prefer withCount-populated properties to avoid triggering lazy-loading
            product_count: $model->products_count ?? ($model->relationLoaded('products') ? $model->products?->count() : null),
            order_count: $model->orders_count ?? ($model->relationLoaded('orders') ? $model->orders?->count() : null),
            products: $model->relationLoaded('products') ? $model->products?->map(fn ($prod) => ProductData::from($prod))?->values()?->all() : null,
            orders: $model->relationLoaded('orders') ? $model->orders?->map(fn ($order) => OrderData::from($order))?->values()?->all() : null,
        );
    }
}
