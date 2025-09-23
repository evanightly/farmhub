<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'account_id', // foreign key ke accounts table - much better lord!
        'payment_method', // 'bank_transfer', 'e_wallet', 'cash' - untuk offline
        'amount',
        'proof_image_path',
        'payment_date',
        'verified_at',
        'verified_by',
        'notes',
        'reference_number', // nomor referensi dari bank/e-wallet
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->whereNotNull('verified_at');
    }

    public function scopePending($query)
    {
        return $query->whereNull('verified_at');
    }

    // Helper methods
    public function getFormattedAmountAttribute()
    {
        return 'Rp '.number_format($this->amount, 0, ',', '.');
    }

    public function getStatusAttribute()
    {
        return $this->verified_at ? 'verified' : 'pending';
    }
}
