<?php

namespace App\Data;

use Illuminate\Support\Str;
use Spatie\LaravelData\Data;

/** @typescript */
class ProductImageData extends Data {
    public function __construct(
        public int $id,
        public ?string $url = null,
        public ?string $alt_text = null,
        public ?bool $is_primary = null,
    ) {}

    public static function fromModel($model): self {
        return new self(
            id: $model->id,
            url: Str::startsWith($model->image_path, 'http') ? $model->image_path : asset('storage/' . $model->image_path),
            alt_text: $model->alt_text,
            is_primary: $model->is_primary,
        );
    }
}
