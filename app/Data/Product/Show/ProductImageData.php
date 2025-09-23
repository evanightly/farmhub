<?php

namespace App\Data\Product\Show;

use Illuminate\Support\Str;
use Spatie\LaravelData\Data;

/** @typescript */
class ProductImageData extends Data {
    public function __construct(
        public int $id,
        public string $url,
        public string $alt_text,
        public bool $is_primary,
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
