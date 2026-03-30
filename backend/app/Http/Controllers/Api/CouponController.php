<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Models\Order;
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
        $data = (new CouponResource($coupon))->toArray(request());

        // Enrich with usage stats
        $data['orders_count'] = Order::where('coupon_id', $coupon->id)->count();
        $data['total_discount_given'] = round(
            Order::where('coupon_id', $coupon->id)->sum('discount_amount'), 2
        );

        return response()->json($data);
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

    public function stats(): JsonResponse
    {
        $total    = Coupon::count();
        $active   = Coupon::where('is_active', true)->count();
        $expired  = Coupon::where('expires_at', '<', now())->count();

        $mostUsed = Coupon::orderByDesc('used_count')->first();

        $totalDiscountDistributed = round(
            Order::whereNotNull('coupon_id')->sum('discount_amount'), 2
        );

        return response()->json([
            'total'                => $total,
            'active'               => $active,
            'expired'              => $expired,
            'total_discount_given' => $totalDiscountDistributed,
            'most_used'            => $mostUsed ? [
                'id'         => $mostUsed->id,
                'code'       => $mostUsed->code,
                'used_count' => $mostUsed->used_count,
            ] : null,
        ]);
    }
}
