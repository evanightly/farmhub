<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_unit_id', // foreign key ke product_units
        'product_name', // snapshot saat order
        'unit_label', // snapshot unit label
        'product_price', // snapshot price per unit
        'quantity',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'product_price' => 'decimal:2',
            'quantity' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function product_unit()
    {
        return $this->belongsTo(ProductUnit::class);
    }

    // Boot method untuk auto-calculate subtotal
    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($orderItem) {
    //         // Ambil data dari ProductUnit untuk snapshot
    //         if ($orderItem->product_unit_id && ! $orderItem->product_price) {
    //             $unit = ProductUnit::find($orderItem->product_unit_id);
    //             if ($unit) {
    //                 $orderItem->product_price = $unit->price_per_unit;
    //                 $orderItem->unit_label = $unit->unit_label;
    //                 $orderItem->product_name = $unit->product->name;
    //             }
    //         }

    //         $orderItem->subtotal = $orderItem->quantity * $orderItem->product_price;
    //     });

    //     static::updating(function ($orderItem) {
    //         $orderItem->subtotal = $orderItem->quantity * $orderItem->product_price;
    //     });
    // }

    // Helper methods
    public function getFormattedSubtotalAttribute()
    {
        return 'Rp '.number_format($this->subtotal, 0, ',', '.');
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rp '.number_format($this->product_price, 0, ',', '.');
    }

    public function getDisplayTextAttribute()
    {
        return "{$this->quantity} {$this->unit_label} {$this->product_name}";
    }
}
