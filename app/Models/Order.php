<?php

namespace App\Models;

use App\Observers\OrderObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript, ObservedBy(OrderObserver::class)]
class Order extends Model {
    use HasFactory;

    protected $fillable = [
        'access_token',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'total_amount',
        'status', // pending, confirmed, shipped, delivered, cancelled
        'payment_status', // unpaid, paid, verified
        'order_type', // 'online', 'offline' - untuk pembeli langsung ke lokasi
        'processed_by', // admin yang handle
        'notes',
    ];

    protected function casts(): array {
        return [
            'total_amount' => 'decimal:2',
        ];
    }

    public function order_items() {
        return $this->hasMany(OrderItem::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }

    public function processor() {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function getFormattedTotalAttribute() {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }
}
