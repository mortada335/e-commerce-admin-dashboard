<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query();

        if ($request->search) {
            $query->where('code', 'ilike', "%{$request->search}%");
        }

        if (isset($request->is_active)) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $coupons = $query->latest()->paginate(15);

        return response()->json([
            'data' => CouponResource::collection($coupons->items()),
            'meta' => ['total' => $coupons->total(), 'current_page' => $coupons->currentPage()],
        ]);
    }

    public function store(StoreCouponRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }
        $coupon = Coupon::create($data);
        return response()->json(new CouponResource($coupon), 201);
    }

    public function show(Coupon $coupon): JsonResponse
    {
        return response()->json(new CouponResource($coupon));
    }

    public function update(StoreCouponRequest $request, Coupon $coupon): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['code']) && $data['code'] === $coupon->code) {
            unset($data['code']);
        }
        $coupon->update($data);
        return response()->json(new CouponResource($coupon->fresh()));
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        // Guard: prevent deleting coupons used by orders
        if ($coupon->orders()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a coupon that has been used in orders. Deactivate it instead.',
            ], 422);
        }

        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted.']);
    }

    public function validate(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string', 'subtotal' => 'required|numeric']);
        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json(['message' => 'Invalid or expired coupon.'], 422);
        }

        if ($coupon->min_order_amount && $request->subtotal < $coupon->min_order_amount) {
            return response()->json([
                'message' => "Minimum order amount is {$coupon->min_order_amount}."
            ], 422);
        }

        return response()->json([
            'coupon'   => new CouponResource($coupon),
            'discount' => $coupon->calculateDiscount($request->subtotal),
        ]);
    }
}
