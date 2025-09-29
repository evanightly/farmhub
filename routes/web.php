<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductUnitController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/cart', 'cart')->name('cart');
Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
Route::get('/payment-instructions/{order}', [OrderController::class, 'paymentInstructions'])->name('payment-instructions');
Route::post('/orders/{order}/upload-proof', [PaymentController::class, 'uploadProof'])->name('payment.upload-proof');
Route::get('/transactions', [OrderController::class, 'transactions'])->name('transactions');
Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
Route::post('/orders/{order}/upload-proof-qr', [PaymentController::class, 'uploadProofWithToken'])->name('payment.upload-proof-qr');

// Admin routes
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [OrderController::class, 'adminDashboard'])->name('admin.dashboard');
    Route::get('/orders', [OrderController::class, 'adminOrders'])->name('admin.orders');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
    Route::get('/payments', [PaymentController::class, 'index'])->name('admin.payments');
    Route::post('/payments/{payment}/verify', [PaymentController::class, 'verify'])->name('admin.payments.verify');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('accounts', AccountController::class)->except(['index']);
    Route::resource('orders', OrderController::class)->except(['index', 'show']);
    Route::resource('order-items', OrderItemController::class)->except(['index']);
    Route::resource('payments', PaymentController::class)->except(['index']);
    Route::resource('products', ProductController::class)->except(['index']);
    Route::resource('product-images', ProductImageController::class)->except(['index']);
    Route::resource('product-units', ProductUnitController::class)->except(['index']);

    // Product units and images reordering
    Route::post('products/{product}/units/reorder', [ProductUnitController::class, 'reorder'])->name('products.units.reorder');
    Route::post('products/{product}/images/reorder', [ProductImageController::class, 'reorder'])->name('products.images.reorder');
});

Route::resource('accounts', AccountController::class)->only(['index']);
Route::resource('orders', OrderController::class)->only(['index']);
Route::resource('order-items', OrderItemController::class)->only(['index']);
Route::resource('payments', PaymentController::class)->only(['index']);
Route::resource('products', ProductController::class)->only(['index']);
Route::resource('product-images', ProductImageController::class)->only(['index']);
Route::resource('product-units', ProductUnitController::class)->only(['index']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
