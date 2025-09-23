<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'harvest_date',
        'expiry_date',
        'is_active',
        'created_by', // foreign key to users
        'meta_data', // JSON untuk atribut khusus per produk
    ];

    protected function casts(): array
    {
        return [
            'harvest_date' => 'date',
            'expiry_date' => 'date',
            'is_active' => 'boolean',
            'meta_data' => 'array',
        ];
    }

    // Relationships
    public function product_units()
    {
        return $this->hasMany(ProductUnit::class);
    }

    public function product_images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes - because we're fancy
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->whereHas('units', function ($q) {
            $q->where('stock_quantity', '>', 0);
        });
    }

    // Helper methods - now delegated to units
    public function getMinPriceAttribute()
    {
        return $this->units()->active()->min('price_per_unit') ?? 0;
    }

    public function getMaxPriceAttribute()
    {
        return $this->units()->active()->max('price_per_unit') ?? 0;
    }

    public function getFormattedPriceRangeAttribute()
    {
        $min = $this->min_price;
        $max = $this->max_price;

        if ($min == $max) {
            return 'Rp '.number_format($min, 0, ',', '.');
        }

        return 'Rp '.number_format($min, 0, ',', '.').' - Rp '.number_format($max, 0, ',', '.');
    }

    public function getDefaultUnitAttribute()
    {
        return $this->units()->active()->orderBy('sort_order')->first();
    }

    public function getTotalStockAttribute()
    {
        // Convert semua unit ke base unit untuk total stock
        return $this->units()->active()->sum('stock_quantity');
    }
}
