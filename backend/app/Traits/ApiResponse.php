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

        if ($data !== null) {
            $response['data'] = $data;
        }

        if ($meta !== null) {
            $response['meta'] = $meta;
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
