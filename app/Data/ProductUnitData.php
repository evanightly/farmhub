<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class ProductUnitData extends Data {
    // 'product_id',
    //     'unit_type', // 'kg', 'karung', 'ton', 'pieces', 'ikat'
    //     'unit_label', // 'Kilogram', 'Karung (25kg)', 'Ton', 'Buah', 'Ikat'
    //     'price_per_unit',
    //     'stock_quantity',
    //     'is_active',
    //     'sort_order', // urutan display (kg -> karung -> ton)
    //     'notes', // catatan khusus per unit
    public function __construct(
        public ?int $id = null,
        public ?int $product_id = null,
        public ?string $unit_type = null,
        public ?string $unit_label = null,
        public ?float $price_per_unit = null,
        public ?float $stock_quantity = null,
        public ?bool $is_active = null,
        public ?int $sort_order = null,
        public ?string $notes = null,
        public ?string $formatted_price_per_unit = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            product_id: $model->product_id,
            unit_type: $model->unit_type,
            unit_label: $model->unit_label,
            price_per_unit: $model->price_per_unit,
            stock_quantity: $model->stock_quantity,
            is_active: $model->is_active,
            sort_order: $model->sort_order,
            notes: $model->notes,
            formatted_price_per_unit: number_format($model->price_per_unit, 2, ',', '.'),
        );
    }
}
