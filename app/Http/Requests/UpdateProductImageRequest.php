<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductImageRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'product_id' => 'sometimes|exists:products,id',
            'image_path' => 'sometimes|image|max:2048', // Optional, max 2MB
            'alt_text' => 'nullable|string|max:255',
            'is_primary' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }
}
