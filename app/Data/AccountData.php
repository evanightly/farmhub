<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class AccountData extends Data {
    public function __construct(
        public int $id,
        public ?string $account_name,
        public ?string $owner_name,
        public ?string $account_no,
        public ?string $account_type,
        public ?string $account_logo,
        public ?string $instructions,
        public ?bool $is_active,
        public ?int $sort_order,
        public ?array $metadata,
        /** @var PaymentData[]|null */
        public ?array $payments = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            account_name: $model->account_name,
            owner_name: $model->owner_name,
            account_no: $model->account_no,
            account_type: $model->account_type,
            account_logo: $model->account_logo,
            instructions: $model->instructions,
            is_active: $model->is_active,
            sort_order: $model->sort_order,
            metadata: $model->metadata,
            payments: $model->payments?->map(fn ($item) => PaymentData::from($item))?->values()?->all(),
        );
    }
}
