<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

abstract class BaseResourceController extends Controller
{
    protected string $modelClass; // Must be set in child

    protected array $allowedFilters = [];

    protected array $allowedSorts = [];

    protected array $allowedIncludes = [];

    protected array $defaultIncludes = [];

    /**
     * Default sorts (applied in order) when no explicit ?sort= is provided.
     * Child controllers may set this to an empty array to opt-out of defaults.
     */
    protected array $defaultSorts = [];

    /**
     * Override to supply extra AllowedFilter callbacks or custom filters.
     * Return an array merging scalar filter names and AllowedFilter instances.
     */
    protected function filters(): array
    {
        return $this->allowedFilters; // Child can extend
    }

    protected function baseQuery(Request $request)
    {
        return QueryBuilder::for($this->modelClass)
            ->allowedFilters($this->filters())
            ->allowedSorts(array_merge($this->allowedSorts, $this->extraSorts()))
            ->allowedIncludes($this->allowedIncludes)
            ->with($this->defaultIncludes);
    }

    /**
     * Hook for child controllers to supply complex / callback / field-mapped sorts (AllowedSort instances).
     */
    protected function extraSorts(): array
    {
        return [];
    }

    protected function buildIndexQuery(Request $request)
    {
        $builder = $this->baseQuery($request);
        if (! empty($this->defaultSorts)) {
            foreach ($this->defaultSorts as $sort) {
                $builder->defaultSort($sort);
            }
        }

        return $builder;
    }

    protected function respond(Request $request, string $inertiaComponent, array $data): Response|JsonResponse
    {
        return $request->wantsJson()
            ? response()->json($data)
            : Inertia::render($inertiaComponent, $data);
    }

    protected function persist(array $data, int $userId): Model
    {
        $data['user_id'] = $userId; // common pattern for owned models
        /** @var Model $model */
        $model = $this->modelClass::create($data);

        return $model;
    }

    protected function updateModel(Model $model, array $data, int $userId): void
    {
        $data['user_id'] = $userId; // preserve consistency
        $model->update($data);
    }
}
