<?php

namespace App\Http\Controllers;

use App\Data\ProductData;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\QueryFilters\SearchFilter;
use Illuminate\Http\Request;

class ProductController extends BaseResourceController
{
    protected string $modelClass = Product::class;

    protected array $allowedFilters = ['search', 'name', 'description'];

    protected array $allowedSorts = ['created_at', 'updated_at'];

    protected array $allowedIncludes = [
        'product_units',
        'product_images',
        'creator',
        'order_items',
    ];

    protected array $defaultIncludes = [
        'product_units',
        'product_images',
    ];

    protected array $defaultSorts = ['-updated_at'];

    // Override filters aggregation to plug custom filter objects
    protected function filters(): array
    {
        return [
            'name',
            'description',
            SearchFilter::make(['name', 'description']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $this->buildIndexQuery($request);

        $items = $query->paginate($request->get('per_page'))->appends($request->query());

        // Map to Data for consistent frontend typing
        $resource = ProductData::collect($items);

        if ($request->wantsJson()) {
            return $resource;
        }

        return $this->respond($request, 'bookmark-url/index', [
            'items' => $resource,
            'filters' => $request->only($this->allowedFilters),
            'sort' => $request->query('sort', $this->defaultSorts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
