<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreProductImageRequest extends FormRequest {
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
            'product_id' => ['required', 'exists:products,id'],
            'images' => ['required', 'array'],
            'images.*' => ['required', 'image', 'max:10240'], // 10MB max
            'is_primary' => ['boolean'],
            'alt_texts' => ['array'],
            'alt_texts.*' => ['nullable', 'string', 'max:255'],
        ];
    }
}
