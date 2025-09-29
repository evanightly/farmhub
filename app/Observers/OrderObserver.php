<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Str;

class OrderObserver {
    /**
     * Handle the Order "creating" event.
     */
    public function creating(Order $order): void {
        if (empty($order->access_token)) {
            $order->access_token = Str::random(32);
        }
    }

    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void {
        //
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void {
        //
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void {
        //
    }
}
