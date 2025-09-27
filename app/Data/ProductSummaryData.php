<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class ProductSummaryData extends Data {
    public function __construct(
        public int $id,
        public ?string $name = null,
        public ?string $formatted_created_at = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            name: $model->name,
            formatted_created_at: $model->created_at?->toDayDateTimeString(),
        );
    }
}
