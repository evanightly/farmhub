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
use App\Models\Product;
use App\QueryFilters\OrderSearchFilter;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller {
    public function index() {
        //
    }

    public function create() {
        //
    }

    public function checkout() {
        $accounts = Account::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($account) => AccountData::from($account));

        return Inertia::render('checkout', [
            'accounts' => $accounts,
        ]);
    }

    public function store(StoreOrderRequest $request) {
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'total_amount' => $validated['total_amount'],
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'order_type' => 'online',
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['order_items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_unit_id' => $item['product_unit_id'],
                    'product_name' => $product->name,
                    'product_price' => $item['product_price'],
                    'quantity' => $item['quantity'],
                    'unit_label' => $item['unit_label'],
                    'subtotal' => $item['quantity'] * $item['product_price'],
                ]);
            }

            $selectedAccount = Account::findOrFail($validated['selected_account_id']);

            $payment = Payment::create([
                'order_id' => $order->id,
                'account_id' => $selectedAccount->id,
                'amount' => $validated['total_amount'],
                'payment_method' => $selectedAccount->account_type,
                'payment_date' => now(),
            ]);

            DB::commit();

            return redirect()->route('payment-instructions', $order);

        } catch (\Exception $e) {
            DB::rollBack();
            logger('Order creation failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['error' => 'Failed to create order. Please try again.'])
                ->withInput();
        }
    }

    public function paymentInstructions(Order $order) {
        $order->load(['payment.account', 'order_items']);

        // Generate QR code for transaction reference with access token
        $transactionUrl = url("/orders/{$order->id}?token={$order->access_token}");
        $qrCodeDataUri = $this->generateQrCode($transactionUrl);

        return Inertia::render('payment-instructions', [
            'order' => OrderData::from($order),
            'payment' => $order->payment ? PaymentData::from($order->payment) : null,
            'account' => $order->payment?->account ? AccountData::from($order->payment->account) : null,
            'qrCodeDataUri' => $qrCodeDataUri,
        ]);
    }

    private function generateQrCode(string $url): string {
        $result = new Builder(
            data: $url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::Medium,
            size: 200,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            writer: new PngWriter,
        );

        return $result->build()->getDataUri();
    }

    public function transactions(Request $request) {
        $email = $request->get('email');
        $orders = collect();

        // Security: Only allow searching own email if authenticated, or specific email if admin
        if (Auth::check()) {
            $user = Auth::user();

            // If admin/employee, allow searching any email or show all orders by default
            if ($user->role === 'admin' || $user->role === 'employee') {
                if ($email) {
                    $orders = Order::where('customer_email', $email)
                        ->with(['order_items.product', 'payment'])
                        ->orderBy('created_at', 'desc')
                        ->get()
                        ->map(fn ($order) => OrderData::from($order));
                } else {
                    // Show all orders for admin/employee by default
                    $orders = Order::with(['order_items.product', 'payment'])
                        ->orderBy('created_at', 'desc')
                        // ->limit(50) // Limit to prevent performance issues
                        ->get()
                        ->map(fn ($order) => OrderData::from($order));
                }
            } else {
                // Regular users can only see their own orders automatically
                $orders = Order::where('customer_email', $user->email)
                    ->with(['order_items.product', 'payment'])
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(fn ($order) => OrderData::from($order));
            }
        } else {
            // Unauthenticated users cannot search by email for security
            if ($email) {
                // Return empty result for security
                $orders = collect();
            }
        }

        return Inertia::render('transactions', [
            'orders' => $orders,
            'searchEmail' => Auth::check() ? $email : null,
            'isAdmin' => Auth::check() && (Auth::user()?->role === 'admin' || Auth::user()?->role === 'employee'),
        ]);
    }

    public function adminDashboard() {
        // Ensure only admin or employee can access
        if (!Auth::check() || (Auth::user()?->role !== 'admin' && Auth::user()?->role !== 'employee')) {
            abort(403, 'Admin or employee access required.');
        }

        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'confirmed_orders' => Order::where('status', 'confirmed')->count(),
            'shipped_orders' => Order::where('status', 'shipped')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => Order::where('payment_status', 'verified')->sum('total_amount'),
            'total_customers' => Order::distinct('customer_email')->count('customer_email'),
            'total_products' => Product::count(),
        ];

        return Inertia::render('admin-dashboard', [
            'stats' => $stats,
        ]);
    }

    public function getChartData(Request $request) {
        // Ensure only admin or employee can access
        if (!Auth::check() || (Auth::user()?->role !== 'admin' && Auth::user()?->role !== 'employee')) {
            abort(403, 'Admin or employee access required.');
        }

        $dateFrom = $request->input('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));

        // Daily orders and revenue data
        $dailyData = Order::whereBetween('created_at', [$dateFrom, $dateTo])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, SUM(CASE WHEN payment_status = "verified" THEN total_amount ELSE 0 END) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'orders' => (int) $item->orders,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Order status distribution
        $statusData = Order::whereBetween('created_at', [$dateFrom, $dateTo])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                $statusLabels = [
                    'pending' => 'Menunggu',
                    'confirmed' => 'Dikonfirmasi',
                    'shipped' => 'Dikirim',
                    'delivered' => 'Diterima',
                    'cancelled' => 'Dibatalkan',
                ];

                return [
                    'status' => $statusLabels[$item->status] ?? $item->status,
                    'count' => (int) $item->count,
                    'fill' => $this->getStatusColor($item->status),
                ];
            });

        // Top products
        $topProducts = Order::whereBetween('orders.created_at', [$dateFrom, $dateTo])
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->selectRaw('products.name, SUM(order_items.quantity) as total_quantity')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_quantity', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'quantity' => (int) $item->total_quantity,
                ];
            });

        // Monthly comparison (current period vs previous period)
        $periodDays = now()->parse($dateTo)->diffInDays(now()->parse($dateFrom)) + 1;
        $previousDateFrom = now()->parse($dateFrom)->subDays($periodDays)->format('Y-m-d');
        $previousDateTo = now()->parse($dateFrom)->subDay()->format('Y-m-d');

        $currentStats = [
            'orders' => Order::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'revenue' => Order::whereBetween('created_at', [$dateFrom, $dateTo])
                ->where('payment_status', 'verified')->sum('total_amount'),
        ];

        $previousStats = [
            'orders' => Order::whereBetween('created_at', [$previousDateFrom, $previousDateTo])->count(),
            'revenue' => Order::whereBetween('created_at', [$previousDateFrom, $previousDateTo])
                ->where('payment_status', 'verified')->sum('total_amount'),
        ];

        return response()->json([
            'daily_data' => $dailyData,
            'status_data' => $statusData,
            'top_products' => $topProducts,
            'comparison' => [
                'current' => $currentStats,
                'previous' => $previousStats,
                'orders_change' => $previousStats['orders'] > 0
                    ? round((($currentStats['orders'] - $previousStats['orders']) / $previousStats['orders']) * 100, 2)
                    : 0,
                'revenue_change' => $previousStats['revenue'] > 0
                    ? round((($currentStats['revenue'] - $previousStats['revenue']) / $previousStats['revenue']) * 100, 2)
                    : 0,
            ],
        ]);
    }

    private function getStatusColor($status) {
        return match ($status) {
            'pending' => '#f59e0b',     // amber-500
            'confirmed' => '#3b82f6',   // blue-500
            'shipped' => '#8b5cf6',     // violet-500
            'delivered' => '#10b981',   // emerald-500
            'cancelled' => '#ef4444',   // red-500
            default => '#6b7280',       // gray-500
        };
    }

    public function adminOrders(Request $request) {
        // Ensure only admin or employee can access
        if (!Auth::check() || (Auth::user()?->role !== 'admin' && Auth::user()?->role !== 'employee')) {
            abort(403, 'Admin or employee access required.');
        }

        $query = QueryBuilder::for(Order::class)
            ->with(['order_items.product', 'payment'])
            ->allowedFilters([
                OrderSearchFilter::make(['id', 'customer_name', 'customer_email']),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('payment_status'),
                AllowedFilter::callback('date_from', function ($query, $value) {
                    $query->whereDate('created_at', '>=', $value);
                }),
                AllowedFilter::callback('date_to', function ($query, $value) {
                    $query->whereDate('created_at', '<=', $value);
                }),
            ])
            ->defaultSort('-created_at');

        $perPage = $request->input('per_page', 15);
        $orders = $query->paginate($perPage)->appends($request->query());

        return Inertia::render('admin-orders', [
            'orders' => $orders->through(fn ($order) => OrderData::from($order)),
            'filters' => $request->only(['filter', 'sort', 'page', 'per_page']),
        ]);
    }

    public function updateStatus(Request $request, Order $order) {
        $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function show(Request $request, Order $order) {
        // Security check: Verify access token for unauthenticated users
        $isQrAccess = false;
        $accessToken = null;

        if (!Auth::check()) {
            $token = $request->get('token');
            if (!$token || $token !== $order->access_token) {
                abort(403, 'Unauthorized access to this order.');
            }
            $isQrAccess = true;
            $accessToken = $token;
        } else {
            // Authenticated users: Admin can see all, users can only see their own
            $user = Auth::user();
            if ($user->role !== 'admin' && $user->role !== 'employee' && $order->customer_email !== $user->email) {
                abort(403, 'Unauthorized access to this order.');
            }
        }

        $order->load([
            'order_items.product.product_units',
            'payment.account',
            'processor',
        ]);

        return Inertia::render('order-details', [
            'order' => OrderData::from($order),
            'isQrAccess' => $isQrAccess,
            'accessToken' => $accessToken,
            'canUploadPayment' => $isQrAccess && in_array($order->payment_status, ['unpaid', 'pending', 'rejected']),
        ]);
    }

    public function edit(Order $order) {
        //
    }

    public function update(UpdateOrderRequest $request, Order $order) {
        //
    }

    public function destroy(Order $order) {
        //
    }
}
