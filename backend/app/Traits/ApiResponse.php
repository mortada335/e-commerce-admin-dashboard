<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Return a standardized success response.
     *
     * @param mixed       $data    The resource data (single item, collection, or null)
     * @param array|null  $meta    Pagination or additional metadata
     * @param int         $code    HTTP status code
     * @param string|null $message Optional success message
     */
    protected function successResponse(
        mixed $data = null,
        ?array $meta = null,
        int $code = 200,
        ?string $message = null
    ): JsonResponse {
        $response = ['success' => true];

        if ($message !== null) {
            $response['message'] = $message;
        }

        // If pagination meta is provided, wrap data in Django-style paginated format
        // Frontend expects: { data: { count, results, next, previous } }
        if ($meta !== null && $data !== null) {
            $currentPage = $meta['current_page'] ?? 1;
            $lastPage = $meta['last_page'] ?? 1;
            $total = $meta['total'] ?? 0;

            $response['data'] = [
                'count'    => $total,
                'next'     => $currentPage < $lastPage ? $currentPage + 1 : null,
                'previous' => $currentPage > 1 ? $currentPage - 1 : null,
                'results'  => $data,
            ];
            // Also include meta for any other consumers
            $response['meta'] = $meta;
        } else {
            if ($data !== null) {
                $response['data'] = $data;
            }

            if ($meta !== null) {
                $response['meta'] = $meta;
            }
        }

        return response()->json($response, $code);
    }

    /**
     * Return a standardized error response.
     */
    protected function errorResponse(
        string $code,
        string $message,
        mixed $details = null,
        int $httpCode = 422
    ): JsonResponse {
        $error = [
            'code'    => $code,
            'message' => $message,
        ];

        if ($details !== null) {
            $error['details'] = $details;
        }

        return response()->json([
            'success' => false,
            'error'   => $error,
        ], $httpCode);
    }

    /**
     * Extract standard pagination meta from a LengthAwarePaginator.
     */
    protected function paginationMeta($paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'per_page'     => $paginator->perPage(),
            'total'        => $paginator->total(),
            'from'         => $paginator->firstItem(),
            'to'           => $paginator->lastItem(),
        ];
    }
}
