<?php

namespace App\Data;

use App\Models\Account;
use Spatie\LaravelData\Data;

class PaymentData extends Data {
    //     'order_id',
    //         'account_id', // foreign key ke accounts table - much better lord!
    //         'payment_method', // 'bank_transfer', 'e_wallet', 'cash' - untuk offline
    //         'amount',
    //         'proof_image_path',
    //         'payment_date',
    //         'verified_at',
    //         'verified_by',
    //         'notes',
    //         'reference_number', // nomor referensi dari bank/e-wallet

    // relations
    // order
    // account
    // verifier
    public function __construct(
        public ?int $id,
        public ?int $order_id,
        public ?int $account_id,
        public ?string $payment_method,
        public ?string $amount,
        public ?string $proof_image_path,
        public ?string $payment_date,
        public ?string $verified_at,
        public ?int $verified_by,
        public ?string $notes,
        public ?string $reference_number,
        public ?OrderData $order = null,
        public ?AccountData $account = null,
        public ?UserData $verifier = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            order_id: $model->order_id,
            account_id: $model->account_id,
            payment_method: $model->payment_method,
            amount: $model->amount,
            proof_image_path: $model->proof_image_path,
            payment_date: $model->payment_date?->toDateTimeString(),
            verified_at: $model->verified_at?->toDateTimeString(),
            verified_by: $model->verified_by,
            notes: $model->notes,
            reference_number: $model->reference_number,
            order: $model->order ? OrderData::from($model->order) : null,
            account: $model->account ? AccountData::from($model->account) : null,
            verifier: $model->verifier ? UserData::from($model->verifier) : null,
        );
    }
}
