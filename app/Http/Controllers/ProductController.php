<?php

namespace App\Http\Controllers;

use App\Data\ProductData;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\QueryFilters\SearchFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends BaseResourceController {
    protected string $modelClass = Product::class;
    protected array $allowedFilters = ['search', 'name', 'description'];
    protected array $allowedSorts = ['name', 'created_at', 'updated_at'];
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
        $resource = ProductData::collect($items);

        if ($request->wantsJson()) {
            return $resource;
        }

        return $this->respond($request, 'product/index', [
            'items' => $resource,
            'filters' => $request->only($this->allowedFilters),
            'sort' => $request->query('sort', $this->defaultSorts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        return Inertia::render('product/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request) {
        $validated = $request->validated();
        // Remove images from validated data
        $images = $request->file('images') ?? [];
        $isPrimary = $request->boolean('is_primary') ?? [];
        unset($validated['images'], $validated['is_primary']);

        // Create product
        $product = Product::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        // Handle image uploads
        foreach ($images as $index => $image) {
            $path = $image->store('product-images', 'public');

            $product->product_images()->create([
                'image_path' => $path,
                'alt_text' => $validated['name'], // Using product name as alt text
                'is_primary' => isset($isPrimary[$index]) ? $isPrimary[$index] : false,
                'sort_order' => $index + 1,
            ]);
        }

        session()->flash('success', 'Product created successfully');

        return $request->wantsJson()
            ? response()->json(ProductData::from($product->load('product_images')), 201)
            : redirect()->route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product) {
        $product->load($this->defaultIncludes);

        return $this->respond(request(), 'product/show', [
            'item' => ProductData::from($product),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product) {
        return Inertia::render('product/edit', [
            'item' => ProductData::from($product->load($this->defaultIncludes)),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product) {
        $product->update($request->validated());
        session()->flash('success', 'Product updated successfully');

        return $request->wantsJson() ? response()->json($product) : redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product) {
        $product->delete();
        session()->flash('success', 'Product deleted successfully');

        return request()->wantsJson() ? response()->json(null, 204) : redirect()->route('products.index');
    }
}
