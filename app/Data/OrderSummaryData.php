<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class OrderSummaryData extends Data {
    public function __construct(
        public int $id,
        public string $status,
        public string $payment_status,
        public ?string $formatted_created_at = null,
        public ?string $formatted_total = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            status: $model->status,
            payment_status: $model->payment_status,
            formatted_created_at: $model->created_at?->toDayDateTimeString(),
            formatted_total: $model->formatted_total ?? null,
        );
    }
}
