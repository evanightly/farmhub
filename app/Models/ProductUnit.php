<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ProductUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'unit_type', // 'kg', 'karung', 'ton', 'pieces', 'ikat'
        'unit_label', // 'Kilogram', 'Karung (25kg)', 'Ton', 'Buah', 'Ikat'
        'price_per_unit',
        'stock_quantity',
        'is_active',
        'sort_order', // urutan display (kg -> karung -> ton)
        'notes', // catatan khusus per unit
    ];

    protected function casts(): array
    {
        return [
            'price_per_unit' => 'decimal:2',
            'stock_quantity' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('unit_weight');
    }

    // Helper methods - where the magic happens
    public function getFormattedPriceAttribute()
    {
        return 'Rp '.number_format($this->price_per_unit, 0, ',', '.');
    }

    public function getStockDisplayAttribute()
    {
        return $this->stock_quantity.' '.$this->unit_label;
    }

    public function getPricePerGramAttribute()
    {
        return $this->unit_weight > 0 ? $this->price_per_unit / $this->unit_weight : 0;
    }
}
