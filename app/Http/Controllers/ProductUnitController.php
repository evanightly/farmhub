<?php

namespace App\Http\Controllers;

use App\Data\ProductUnitData;
use App\Http\Requests\StoreProductUnitRequest;
use App\Http\Requests\UpdateProductUnitRequest;
use App\Models\Product;
use App\Models\ProductUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductUnitController extends Controller {
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
     * Store a newly created resource in storage.
     */
    public function store(StoreProductUnitRequest $request): JsonResponse|RedirectResponse {
        $unit = ProductUnit::create($request->validated());

        session()->flash('success', 'Unit added successfully');

        return $request->wantsJson() ?
            response()->json(ProductUnitData::from($unit)) :
            redirect()->route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductUnit $productUnit) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductUnit $productUnit) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductUnitRequest $request, ProductUnit $productUnit) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductUnit $productUnit) {
        $productUnit->delete();
        session()->flash('success', 'Product unit deleted successfully');

        return request()->wantsJson() ? response()->json(null, 204) : redirect()->route('products.index');
    }

    /**
     * Reorder product units
     */
    public function reorder(Product $product, Request $request) {
        $request->validate([
            'units' => 'required|array',
            'units.*.id' => 'required|exists:product_units,id',
            'units.*.sort_order' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $product) {
            foreach ($request->units as $unit) {
                $product->product_units()
                    ->where('id', $unit['id'])
                    ->update(['sort_order' => $unit['sort_order']]);
            }
        });

        session()->flash('success', 'Units reordered successfully');

        return $request->wantsJson() ?
            response()->json(['message' => 'Units reordered successfully']) :
            redirect()->route('products.show', $product);
    }
}
