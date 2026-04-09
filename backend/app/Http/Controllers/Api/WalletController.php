<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    use ApiResponse;

    /**
     * GET /wallet/admin/gift-cards
     */
    public function giftCards(Request $request): JsonResponse
    {
        // Stub — returns empty paginated result
        return $this->successResponse([
            'current_page' => 1,
            'data' => [],
            'total' => 0,
            'per_page' => $request->input('page_size', 25),
            'last_page' => 1,
        ]);
    }

    /**
     * POST /wallet/admin/gift-cards
     */
    public function storeGiftCard(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        return $this->successResponse(['message' => 'Gift card created.'], null, 201);
    }

    /**
     * POST /wallet/admin/gift-cards/bulk-create
     */
    public function bulkCreateGiftCards(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'count'  => 'required|integer|min:1',
        ]);

        return $this->successResponse(['message' => "{$request->count} gift cards created."], null, 201);
    }

    /**
     * GET /wallet/admin/wallet-transactions
     */
    public function walletTransactions(Request $request): JsonResponse
    {
        return $this->successResponse([
            'current_page' => 1,
            'data' => [],
            'total' => 0,
            'per_page' => $request->input('page_size', 25),
            'last_page' => 1,
        ]);
    }
}
