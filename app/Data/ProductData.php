<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class ProductData extends Data
{
    public function __construct(
        public ?int $id = null,
        public ?string $name = null,
        public ?string $description = null,
        public ?string $harvest_date = null,
        public ?string $expiry_date = null,
        public ?bool $is_active = null,
        public ?int $created_by = null,
        public ?array $meta_data = null,
        /** @var ProductImageData[]|null */
        public ?array $product_images = null,
    ) {}

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            name: $model->name,
            description: $model->description,
            harvest_date: $model->harvest_date?->toDateString(),
            expiry_date: $model->expiry_date?->toDateString(),
            is_active: $model->is_active,
            created_by: $model->created_by,
            meta_data: $model->meta_data,
            product_images: $model->product_images?->map(fn ($img) => ProductImageData::from($img))?->all(),
        );
    }
}
