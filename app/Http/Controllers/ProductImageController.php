<?php

namespace App\Http\Controllers;

use App\Data\ProductImageData;
use App\Http\Requests\StoreProductImageRequest;
use App\Http\Requests\UpdateProductImageRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProductImageController extends Controller {
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
    public function store(StoreProductImageRequest $request): JsonResponse|RedirectResponse {
        $validated = $request->validated();
        $product = Product::findOrFail($validated['product_id']);

        /** @var Collection */
        $images = collect($validated['images'])->map(function ($image, $index) use ($product, $validated) {
            $path = $image->store('product-images', 'public');

            return $product->product_images()->create([
                'image_path' => $path,
                'alt_text' => $validated['alt_text'] ?? $product->name,
                'is_primary' => ($validated['is_primary'] ?? false) && $index === 0, // Only first image can be primary if requested
                'sort_order' => $product->product_images()->count() + $index + 1,
            ]);
        });

        // Refresh all images to get computed attributes
        $images = $images->map->refresh();

        session()->flash('success', 'Images uploaded successfully');

        // Always return transformed data
        return response()->json($images->map(fn ($image) => ProductImageData::from($image)));
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImage $productImage) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductImage $productImage) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductImageRequest $request, ProductImage $productImage) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImage $productImage) {
        // try to unlink the image file if it's stored locally
        if (!str_starts_with($productImage->image_path, 'http')) {
            $localPath = storage_path('app/public/' . $productImage->image_path);
            if (file_exists($localPath)) {
                unlink($localPath);
            }
        }
        $productImage->delete();
        session()->flash('success', 'Product image deleted successfully');

        return request()->wantsJson() ? response()->json(null, 204) : redirect()->route('products.index');
    }

    /**
     * Reorder product images
     */
    public function reorder(Product $product, Request $request): JsonResponse {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:product_images,id',
            'images.*.sort_order' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $product) {
            foreach ($request->images as $image) {
                $product->product_images()
                    ->where('id', $image['id'])
                    ->update([
                        'sort_order' => $image['sort_order'],
                        'is_primary' => $image['sort_order'] === 1, // Make first image primary
                    ]);
            }
        });

        return $request->wantsJson() ? response()->json(['message' => 'Images reordered successfully']) : redirect()->route('products.show', $product);
    }
}
