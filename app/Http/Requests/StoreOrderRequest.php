<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true; // Allow all users to create orders
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'total_amount' => 'required|numeric|min:0',
            'selected_account_id' => 'required|integer|exists:accounts,id',
            'order_items' => 'required|array|min:1',
            'order_items.*.product_id' => 'required|integer|exists:products,id',
            'order_items.*.product_unit_id' => 'required|integer|exists:product_units,id',
            'order_items.*.product_name' => 'required|string|max:255',
            'order_items.*.unit_label' => 'required|string|max:50',
            'order_items.*.product_price' => 'required|numeric|min:0',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.subtotal' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        return [
            'customer_name.required' => 'Customer name is required.',
            'customer_email.required' => 'Customer email is required.',
            'customer_email.email' => 'Please provide a valid email address.',
            'customer_phone.required' => 'Customer phone number is required.',
            'shipping_address.required' => 'Shipping address is required.',
            'selected_account_id.required' => 'Please select a payment method.',
            'selected_account_id.exists' => 'The selected payment method is not available.',
            'total_amount.required' => 'Total amount is required.',
            'total_amount.numeric' => 'Total amount must be a valid number.',
            'total_amount.min' => 'Total amount must be at least 0.',
            'selected_account_id.required' => 'Please select a payment method.',
            'selected_account_id.exists' => 'The selected payment method is not available.',
            'order_items.required' => 'At least one order item is required.',
            'order_items.min' => 'At least one order item is required.',
            'order_items.*.product_id.required' => 'Product ID is required for each item.',
            'order_items.*.product_id.exists' => 'The selected product does not exist.',
            'order_items.*.product_unit_id.required' => 'Product unit ID is required for each item.',
            'order_items.*.product_unit_id.exists' => 'The selected product unit does not exist.',
            'order_items.*.quantity.required' => 'Quantity is required for each item.',
            'order_items.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array {
        return [
            'customer_name' => 'customer name',
            'customer_email' => 'customer email',
            'customer_phone' => 'customer phone',
            'shipping_address' => 'shipping address',
            'total_amount' => 'total amount',
            'order_items' => 'order items',
        ];
    }
}
