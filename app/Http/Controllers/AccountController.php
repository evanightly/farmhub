<?php

namespace App\Http\Controllers;

use App\Data\AccountData;
use App\Http\Requests\ReorderAccountRequest;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use App\QueryFilters\SearchFilter;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AccountController extends BaseResourceController {
    use AuthorizesRequests;

    protected string $modelClass = Account::class;
    protected array $allowedFilters = ['search', 'account_name', 'owner_name', 'account_no', 'account_type', 'is_active'];
    protected array $allowedSorts = ['account_name', 'owner_name', 'account_no', 'account_type', 'sort_order', 'is_active', 'created_at', 'updated_at'];
    protected array $allowedIncludes = ['payments'];
    protected array $defaultIncludes = [];
    protected array $defaultSorts = ['sort_order', 'account_name'];

    // Override filters aggregation to plug custom filter objects
    protected function filters(): array {
        return [
            'account_name',
            'owner_name',
            'account_no',
            'account_type',
            'is_active',
            SearchFilter::make(['account_name', 'owner_name', 'account_no']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $this->authorize('viewAny', Account::class);

        $query = $this->buildIndexQuery($request);

        // Optionally include counts for relations without loading their collections.
        if ($request->query('with_counts') || $request->boolean('with_counts')) {
            $query = $query->withCount(['payments']);
        }

        $items = $query->paginate($request->get('per_page', 15))->appends($request->query());

        // Map to Data for consistent frontend typing
        $resource = AccountData::collect($items);

        return $this->respond($request, 'account/index', [
            'items' => $resource,
            'filters' => $request->only($this->allowedFilters),
            'sort' => $request->query('sort', $this->defaultSorts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        $this->authorize('create', Account::class);

        return Inertia::render('account/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request) {
        $this->authorize('create', Account::class);

        $validated = $request->validated();

        // Cast to base Request for file methods
        $baseRequest = request();

        // Handle logo upload
        if ($baseRequest->hasFile('account_logo') && $baseRequest->file('account_logo')->isValid()) {
            $logoPath = $baseRequest->file('account_logo')->store('account-logos', 'public');
            $validated['account_logo'] = $logoPath;
        }

        // Set default values
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? (Account::max('sort_order') + 1);

        $account = Account::create($validated);

        if ($baseRequest->wantsJson()) {
            return response()->json([
                'message' => 'Account created successfully',
                'data' => AccountData::fromModel($account),
            ], 201);
        }

        return redirect()->route('accounts.index')
            ->with('success', 'Account created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account) {
        $this->authorize('view', $account);

        $account->load('payments');

        return $this->respond(request(), 'account/show', [
            'account' => AccountData::from($account),
            'payments_count' => $account->payments_count ?? $account->payments->count(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account) {
        $this->authorize('update', $account);

        return Inertia::render('account/edit', [
            'account' => AccountData::from($account),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account) {
        $this->authorize('update', $account);

        $validated = $request->validated();

        // Cast to base Request for file methods
        $baseRequest = request();

        // Handle logo upload
        if ($baseRequest->hasFile('account_logo') && $baseRequest->file('account_logo')->isValid()) {
            // Delete old logo if exists
            if ($account->account_logo) {
                Storage::disk('public')->delete($account->account_logo);
            }

            $logoPath = $baseRequest->file('account_logo')->store('account-logos', 'public');
            $validated['account_logo'] = $logoPath;
        }

        $account->update($validated);

        if ($baseRequest->wantsJson()) {
            return response()->json([
                'message' => 'Account updated successfully',
                'data' => AccountData::fromModel($account->fresh()),
            ]);
        }

        return redirect()->route('accounts.index')
            ->with('success', 'Account updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Account $account) {
        $this->authorize('delete', $account);

        // Delete logo if exists
        if ($account->account_logo) {
            Storage::disk('public')->delete($account->account_logo);
        }

        $account->delete();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Account deleted successfully']);
        }

        return redirect()->route('accounts.index')
            ->with('success', 'Account deleted successfully');
    }

    /**
     * Reorder accounts
     */
    public function reorder(ReorderAccountRequest $request) {
        $this->authorize('reorder', Account::class);

        foreach ($request['accounts'] as $accountData) {
            Account::where('id', $accountData['id'])
                ->update(['sort_order' => $accountData['sort_order']]);
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Accounts reordered successfully']);
        }

        return redirect()->route('accounts.index')
            ->with('success', 'Accounts reordered successfully');
    }
}
