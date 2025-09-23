<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreProductUnitRequest extends FormRequest {
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
            'unit_type' => ['required', 'string'],
            'unit_label' => ['required', 'string', 'max:255'],
            'price_per_unit' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
