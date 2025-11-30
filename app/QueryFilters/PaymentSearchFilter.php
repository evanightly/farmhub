<?php

namespace App\QueryFilters;

use Spatie\QueryBuilder\AllowedFilter;

class PaymentSearchFilter {
    public static function make(array $columns = ['reference_number']): AllowedFilter {
        return AllowedFilter::callback('search', function ($query, $value) use ($columns) {
            $query->where(function ($q) use ($value, $columns) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'like', "%{$value}%");
                }
                // Also search related order fields
                $q->orWhereHas('order', function ($oq) use ($value) {
                    $oq->where('id', 'like', "%{$value}%")
                        ->orWhere('customer_name', 'like', "%{$value}%")
                        ->orWhere('customer_email', 'like', "%{$value}%");
                });
            });
        });
    }
}
