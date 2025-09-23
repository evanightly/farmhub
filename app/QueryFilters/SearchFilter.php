<?php

namespace App\QueryFilters;

use Spatie\QueryBuilder\AllowedFilter;

class SearchFilter
{
    public static function make(array $columns = ['title', 'description']): AllowedFilter
    {
        return AllowedFilter::callback('search', function ($query, $value) use ($columns) {
            $query->where(function ($q) use ($value, $columns) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'like', "%{$value}%");
                }
            });
        });
    }
}
