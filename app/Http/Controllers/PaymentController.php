<?php

namespace App\Http\Controllers;

use App\Data\PaymentData;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Ensure only admin or employee can access
        if (!Auth::check() || (Auth::user()?->role !== 'admin' && Auth::user()?->role !== 'employee')) {
            abort(403, 'Admin or employee access required.');
        }

        $payments = Payment::with(['order', 'account', 'verifier'])
            ->where('verified_at', null)
            ->whereNotNull('proof_image_path')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin-payments', [
            'payments' => $payments->through(fn ($payment) => PaymentData::from($payment)),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request) {
        //
    }

    /**
     * Upload payment proof
     */
    public function uploadProof(Request $request, Order $order) {
        $request->validate([
            'proof_image' => 'required|image|max:5120', // 5MB max
            'reference_number' => 'nullable|string|max:255',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        $payment = $order->payment;

        if (!$payment) {
            return redirect()->back()->withErrors(['error' => 'Payment record not found.']);
        }

        // Store the uploaded image
        $imagePath = $request->file('proof_image')->store('payment-proofs', 'public');

        // Update payment record
        $payment->update([
            'proof_image_path' => $imagePath,
            'reference_number' => $request->reference_number,
            'payment_date' => $request->payment_date,
            'notes' => $request->notes,
        ]);

        // Update order payment status
        $order->update([
            'payment_status' => 'paid',
        ]);

        return redirect()->back()->with('success', 'Payment proof uploaded successfully! Your payment will be verified by our admin.');
    }

    /**
     * Upload payment proof with access token verification (for QR code access)
     */
    public function uploadProofWithToken(Request $request, Order $order) {
        // Verify access token for unauthenticated access
        $token = $request->get('token');
        if (!$token || $token !== $order->access_token) {
            abort(403, 'Unauthorized access to this order.');
        }

        $request->validate([
            'proof_image' => 'required|image|max:5120', // 5MB max
            'reference_number' => 'nullable|string|max:255',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if payment status allows upload
        if (!in_array($order->payment_status, ['unpaid', 'pending', 'rejected'])) {
            return redirect()->back()->withErrors(['error' => 'Payment proof can only be uploaded for pending or rejected payments.']);
        }

        $payment = $order->payment;

        if (!$payment) {
            return redirect()->back()->withErrors(['error' => 'Payment record not found.']);
        }

        // Store the uploaded image
        $imagePath = $request->file('proof_image')->store('payment-proofs', 'public');

        // Update payment record
        $payment->update([
            'proof_image_path' => $imagePath,
            'reference_number' => $request->reference_number,
            'payment_date' => $request->payment_date,
            'notes' => $request->notes,
            'verified_at' => null, // Reset verification if re-uploading
            'verified_by' => null, // Reset verifier if re-uploading
        ]);

        // Update order payment status
        $order->update([
            'payment_status' => 'paid',
        ]);

        return redirect()->back()->with('success', 'Payment proof uploaded successfully! Your payment will be verified by our admin. You can bookmark this page to check the status later.');
    }

    /**
     * Verify payment by admin
     */
    public function verify(Request $request, Payment $payment) {
        // Ensure only admin or employee can access
        if (!Auth::check() || (Auth::user()?->role !== 'admin' && Auth::user()?->role !== 'employee')) {
            abort(403, 'Admin or employee access required.');
        }

        $request->validate([
            'action' => 'required|in:approve,reject',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        // Load necessary relationships
        $payment->load('order.order_items.product_unit');

        if ($request->action === 'approve') {
            $payment->update([
                'verified_at' => now(),
                'verified_by' => Auth::id(),
                'notes' => $request->admin_notes ?? $payment->notes,
            ]);

            $payment->order->update([
                'payment_status' => 'verified',
            ]);

            // Reduce stock for each order item
            foreach ($payment->order->order_items as $orderItem) {
                $productUnit = $orderItem->product_unit;
                if ($productUnit) {
                    $newStock = $productUnit->stock_quantity - $orderItem->quantity;
                    $productUnit->update([
                        'stock_quantity' => max(0, $newStock), // Ensure stock doesn't go negative
                    ]);
                }
            }

            $message = 'Payment approved and verified successfully. Stock quantities updated.';
        } else {
            // Reject payment - set to rejected status
            $payment->update([
                'verified_at' => null,
                'verified_by' => null,
                'notes' => $request->admin_notes ?? $payment->notes,
            ]);

            $payment->order->update([
                'payment_status' => 'rejected',
            ]);

            $message = 'Payment rejected. Customer will need to upload new proof.';
        }

        return redirect()->route('admin.orders')->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment) {
        //
    }
}
