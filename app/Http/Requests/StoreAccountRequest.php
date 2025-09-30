<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreAccountRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return Auth::user()?->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'account_name' => ['required', 'string', 'max:255'],
            'owner_name' => ['required', 'string', 'max:255'],
            'account_no' => ['required', 'string', 'max:255', 'unique:accounts,account_no'],
            'account_type' => ['required', 'string', 'in:bank_transfer,e_wallet,cash'],
            'account_logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg', 'max:2048'],
            'instructions' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array {
        return [
            'account_name.required' => 'Account name is required.',
            'owner_name.required' => 'Owner name is required.',
            'account_no.required' => 'Account number is required.',
            'account_no.unique' => 'This account number already exists.',
            'account_type.required' => 'Account type is required.',
            'account_type.in' => 'Account type must be bank transfer, e-wallet, or cash.',
            'account_logo.image' => 'Account logo must be an image.',
            'account_logo.mimes' => 'Account logo must be a JPG, JPEG, PNG, or SVG file.',
            'account_logo.max' => 'Account logo may not be greater than 2MB.',
        ];
    }
}
