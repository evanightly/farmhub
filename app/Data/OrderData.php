<?php

namespace App\Data;

use Spatie\LaravelData\Data;

/** @typescript */
class OrderData extends Data {
    public function __construct(
        public int $id,
        public string $access_token, // Non-nullable since always generated
        public string $customer_name,
        public string $customer_email,
        public ?string $customer_phone,
        public ?string $shipping_address,
        public string $total_amount,
        public string $formatted_total,
        public string $status,
        public string $payment_status,
        public string $order_type,
        public ?int $processed_by = null,
        public ?string $notes = null,
        public ?string $created_at = null,
        public ?string $updated_at = null,
        /** @var OrderItemData[]|null */
        public ?array $order_items = null,
        public ?PaymentData $payment = null,
        public ?UserData $processor = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            access_token: $model->access_token,
            customer_name: $model->customer_name,
            customer_email: $model->customer_email,
            customer_phone: $model->customer_phone,
            shipping_address: $model->shipping_address,
            total_amount: $model->total_amount,
            formatted_total: $model->formatted_total,
            status: $model->status,
            payment_status: $model->payment_status,
            order_type: $model->order_type,
            processed_by: $model->processed_by,
            notes: $model->notes,
            created_at: $model->created_at?->toDateTimeString(),
            updated_at: $model->updated_at?->toDateTimeString(),
            order_items: $model->relationLoaded('order_items') ? $model->order_items?->map(fn ($item) => OrderItemData::from($item))?->values()?->all() : null,
            payment: $model->relationLoaded('payment') ? ($model->payment ? PaymentData::from($model->payment) : null) : null,
            processor: $model->relationLoaded('processor') ? ($model->processor ? UserData::from($model->processor) : null) : null,
        );
    }
}
