<?php

namespace App\Http\Controllers;

use App\Data\AccountData;
use App\Data\OrderData;
use App\Data\PaymentData;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Account;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        //
    }

    /**
     * Show the checkout form with available payment accounts.
     */
    public function checkout() {
        $accounts = Account::active()->ordered()->get();

        return Inertia::render('checkout', [
            'accounts' => $accounts->map(fn ($account) => AccountData::from($account)),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request) {
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            // Get the selected account
            $selectedAccount = Account::findOrFail($validated['selected_account_id']);

            // Create the order
            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'],
                'total_amount' => $validated['total_amount'],
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'order_type' => 'online',
                'processed_by' => Auth::id(), // Will be null for non-authenticated users
            ]);

            // Create order items
            foreach ($validated['order_items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_unit_id' => $item['product_unit_id'],
                    'product_name' => $item['product_name'],
                    'unit_label' => $item['unit_label'],
                    'product_price' => $item['product_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            // Create payment record with selected account
            $payment = Payment::create([
                'order_id' => $order->id,
                'account_id' => $selectedAccount->id,
                'payment_method' => $selectedAccount->account_type,
                'amount' => $validated['total_amount'],
                'notes' => 'Payment pending - created from checkout',
            ]);

            DB::commit();

            // Redirect to payment instructions page
            return redirect()->route('payment-instructions', ['order' => $order->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            logger('Order creation failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['error' => 'Failed to create order. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Show payment instructions for the order
     */
    public function paymentInstructions(Order $order) {
        // Load the order with its payment and account details
        $order->load(['payment.account', 'order_items']);

        return Inertia::render('payment-instructions', [
            'order' => OrderData::from($order),
            'payment' => $order->payment ? PaymentData::from($order->payment) : null,
            'account' => $order->payment?->account ? AccountData::from($order->payment->account) : null,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order) {
        //
    }
}
