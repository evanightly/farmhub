<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest {
    public function authorize(): bool {
        return Auth::user()->role === 'admin'; // Only admin users can create products
    }

    public function rules(): array {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'harvest_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after:harvest_date'],
            'is_active' => ['boolean'],
            'meta_data' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'], // 2MB max
        ];
    }

    public function messages(): array {
        return [
            'images.*.image' => 'The file must be an image',
            'images.*.mimes' => 'The image must be a file of type: jpg, jpeg, png, gif',
            'images.*.max' => 'The image may not be greater than 2MB',
            'expiry_date.after' => 'The expiry date must be a date after the harvest date',
        ];
    }
}
