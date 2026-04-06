<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Reusable CRUD operations for admin API controllers.
 * Controllers using this trait must define:
 *   - protected string $modelClass
 *   - protected array $searchFields (optional)
 *   - protected array $filterFields (optional)
 *   - protected array $with (optional, eager-load relations)
 */
trait AdminCrud
{
    use ApiResponse;

    protected function getModelClass(): string
    {
        return $this->modelClass;
    }

    protected function getSearchFields(): array
    {
        return $this->searchFields ?? [];
    }

    protected function getFilterFields(): array
    {
        return $this->filterFields ?? [];
    }

    protected function getWith(): array
    {
        return $this->with ?? [];
    }

    public function index(Request $request): JsonResponse
    {
        $query = $this->getModelClass()::query();

        if (!empty($this->getWith())) {
            $query->with($this->getWith());
        }

        // Search
        if ($request->filled('search') && !empty($this->getSearchFields())) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                foreach ($this->getSearchFields() as $i => $field) {
                    $method = $i === 0 ? 'where' : 'orWhere';
                    $q->$method($field, 'like', "%{$search}%");
                }
            });
        }

        // Filters
        foreach ($this->getFilterFields() as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
        }

        // Date range filters
        foreach (['date_added', 'created_at'] as $dateField) {
            if ($request->filled("{$dateField}_after")) {
                $query->whereDate($dateField, '>=', $request->input("{$dateField}_after"));
            }
            if ($request->filled("{$dateField}_before")) {
                $query->whereDate($dateField, '<=', $request->input("{$dateField}_before"));
            }
        }

        // Ordering
        if ($request->filled('ordering')) {
            $ordering = $request->input('ordering');
            $direction = str_starts_with($ordering, '-') ? 'desc' : 'asc';
            $column = ltrim($ordering, '-');
            $query->orderBy($column, $direction);
        } else {
            $query->latest();
        }

        // Pagination
        $pageSize = min((int) $request->input('page_size', 20), 200);
        $data = $query->paginate($pageSize);

        return $this->paginatedResponse($data);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $item = $this->getModelClass()::query();
        if (!empty($this->getWith())) {
            $item = $item->with($this->getWith());
        }
        $item = $item->findOrFail($id);

        return $this->successResponse($item);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $item = $this->getModelClass()::create($data);

        return $this->successResponse($item, null, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $item = $this->getModelClass()::findOrFail($id);
        $item->update($request->all());

        return $this->successResponse($item->fresh());
    }

    public function partialUpdate(Request $request, $id): JsonResponse
    {
        return $this->update($request, $id);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $item = $this->getModelClass()::findOrFail($id);
        $item->delete();

        return response()->json(null, 204);
    }

    protected function paginatedResponse($paginator): JsonResponse
    {
        return response()->json([
            'count'    => $paginator->total(),
            'next'     => $paginator->nextPageUrl(),
            'previous' => $paginator->previousPageUrl(),
            'results'  => $paginator->items(),
        ]);
    }
}
