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
        ];
    }

    public function messages(): array {
        return [
            'expiry_date.after' => 'The expiry date must be a date after the harvest date',
        ];
    }
}
