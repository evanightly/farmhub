<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/** @typescript */
class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_name', // BRI, BNI, Mandiri, Dana, GoPay, etc
        'owner_name', // nama pemilik rekening
        'account_no', // nomor rekening
        'account_type', // 'bank_transfer', 'e_wallet', 'cash'
        'account_logo', // path to logo image
        'instructions', // instruksi pembayaran khusus
        'is_active', // enable/disable account
        'sort_order', // urutan tampilan
        'metadata', // JSON untuk info tambahan (SWIFT code, branch, etc)
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'metadata' => 'array',
        ];
    }

    // Relationships
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes - because we love clean queries
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('account_name');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('account_type', $type);
    }

    // Helper methods
    public function getFormattedAccountNoAttribute()
    {
        // Format account number for display (hide some digits for security)
        if ($this->account_type === 'bank_transfer') {
            return substr($this->account_no, 0, 4).'****'.substr($this->account_no, -4);
        }

        return $this->account_no;
    }

    public function getDisplayNameAttribute()
    {
        return "{$this->account_name} - {$this->owner_name}";
    }

    // Static helper untuk get active accounts by type
    public static function getActiveByType($type)
    {
        return static::active()->byType($type)->ordered()->get();
    }

    public static function getBankAccounts()
    {
        return static::getActiveByType('bank_transfer');
    }

    public static function getEwallets()
    {
        return static::getActiveByType('e_wallet');
    }
}
