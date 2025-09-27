<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class OrderItemData extends Data {
    public function __construct(
        public int $id,
        public int $order_id,
        public int $product_id,
        public ?int $product_unit_id,
        public string $product_name,
        public string $unit_label,
        public string $product_price,
        public string $quantity,
        public string $subtotal,
        public ?string $created_at = null,
        public ?string $updated_at = null,
        public ?OrderData $order = null,
        public ?ProductData $product = null,
        public ?ProductUnitData $product_unit = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            order_id: $model->order_id,
            product_id: $model->product_id,
            product_unit_id: $model->product_unit_id,
            product_name: $model->product_name,
            unit_label: $model->unit_label,
            product_price: $model->product_price,
            quantity: $model->quantity,
            subtotal: $model->subtotal,
            created_at: $model->created_at?->toDateTimeString(),
            updated_at: $model->updated_at?->toDateTimeString(),
            order: $model->order ? OrderData::from($model->order) : null,
            product: $model->product ? ProductData::from($model->product) : null,
            product_unit: $model->product_unit ? ProductUnitData::from($model->product_unit) : null,
        );
    }
}
