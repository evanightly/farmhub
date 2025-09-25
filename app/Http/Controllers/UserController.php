<?php

namespace App\Http\Controllers;

use App\Data\UserData;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\QueryFilters\SearchFilter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends BaseResourceController {
    protected string $modelClass = User::class;
    protected array $allowedFilters = ['search', 'name', 'description'];
    protected array $allowedSorts = ['name', 'created_at', 'updated_at'];
    protected array $allowedIncludes = [
    ];
    protected array $defaultIncludes = [
    ];
    protected array $defaultSorts = ['-updated_at'];

    // Override filters aggregation to plug custom filter objects
    protected function filters(): array {
        return [
            'name',
            'description',
            SearchFilter::make(['name', 'description']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $query = $this->buildIndexQuery($request);

        $items = $query->paginate($request->get('per_page'))->appends($request->query());

        // Map to Data for consistent frontend typing
        $resource = UserData::collect($items);

        if ($request->wantsJson()) {
            return $resource;
        }

        return $this->respond($request, 'user/index', [
            'items' => $resource,
            'filters' => $request->only($this->allowedFilters),
            'sort' => $request->query('sort', $this->defaultSorts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        return Inertia::render('user/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request) {
        $user = User::create($request->validated());
        session()->flash('success', 'User created successfully');

        return $request->wantsJson()
            ? response()->json(UserData::from($user->load('user_images')), 201)
            : redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user) {
        $user->with($this->defaultIncludes);

        return $this->respond(request(), 'user/show', [
            'item' => UserData::from($user),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user) {
        return Inertia::render('user/edit', [
            'item' => UserData::from($user->load($this->defaultIncludes)),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user) {
        $user->update($request->validated());
        session()->flash('success', 'User updated successfully');

        return $request->wantsJson() ? response()->json($user) : redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user) {
        $user->delete();
        session()->flash('success', 'User deleted successfully');

        return request()->wantsJson() ? response()->json(null, 204) : redirect()->route('users.index');
    }
}
