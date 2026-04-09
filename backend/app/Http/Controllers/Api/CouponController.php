<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query();

        if ($request->search) {
            $query->where('code', 'ilike', "%{$request->search}%");
        }

        if (isset($request->is_active)) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $coupons = $query->latest()->paginate(min((int) $request->get('per_page', 15), 100));

        return $this->successResponse(
            CouponResource::collection($coupons->items()),
            $this->paginationMeta($coupons)
        );
    }

    public function store(StoreCouponRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }
        $coupon = Coupon::create($data);
        return $this->successResponse(new CouponResource($coupon), null, 201);
    }

    public function show(Coupon $coupon): JsonResponse
    {
        $data = (new CouponResource($coupon))->toArray(request());

        // Enrich with usage stats
        $data['orders_count'] = Order::where('coupon_id', $coupon->id)->count();
        $data['total_discount_given'] = round(
            Order::where('coupon_id', $coupon->id)->sum('discount_amount'), 2
        );

        return $this->successResponse($data);
    }

    public function update(StoreCouponRequest $request, Coupon $coupon): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['code']) && $data['code'] === $coupon->code) {
            unset($data['code']);
        }
        $coupon->update($data);
        return $this->successResponse(new CouponResource($coupon->fresh()));
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        // Guard: prevent deleting coupons used by orders
        if ($coupon->orders()->exists()) {
            return $this->errorResponse('VALIDATION_ERROR', 'Cannot delete a coupon that has been used in orders. Deactivate it instead.', null, 422);
        }

        $coupon->delete();
        return $this->successResponse(null, null, 200, 'Coupon deleted.');
    }

    public function validate(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string', 'subtotal' => 'required|numeric']);
        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon || !$coupon->isValid()) {
            return $this->errorResponse('VALIDATION_ERROR', 'Invalid or expired coupon.', null, 422);
        }

        if ($coupon->min_order_amount && $request->subtotal < $coupon->min_order_amount) {
            return $this->errorResponse('VALIDATION_ERROR', "Minimum order amount is {$coupon->min_order_amount}.", null, 422);
        }

        return $this->successResponse([
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

        return $this->successResponse([
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
