<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Review::with(['customer', 'product']);

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->boolean('is_approved'));
        }

        return $query->orderByDesc('created_at')->paginate($request->get('per_page', 15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'customer_id' => 'required|exists:customers,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'is_approved' => 'boolean',
        ]);

        $review = Review::create($validated);

        return response()->json($review->load(['customer', 'product']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        return response()->json($review->load(['customer', 'product']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'is_approved' => 'boolean',
        ]);

        $review->update($validated);

        return response()->json($review->load(['customer', 'product']));
    }

    public function toggleApproval(Review $review)
    {
        $review->update(['is_approved' => !$review->is_approved]);
        return response()->json($review);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();
        return response()->noContent();
    }

    public function stats()
    {
        $total    = Review::count();
        $pending  = Review::where('is_approved', false)->count();
        $avgRating = Review::avg('rating');

        $distribution = Review::selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        return response()->json([
            'total'        => $total,
            'pending'      => $pending,
            'approved'     => $total - $pending,
            'avg_rating'   => round($avgRating ?? 0, 1),
            'distribution' => [
                '5' => $distribution[5] ?? 0,
                '4' => $distribution[4] ?? 0,
                '3' => $distribution[3] ?? 0,
                '2' => $distribution[2] ?? 0,
                '1' => $distribution[1] ?? 0,
            ],
        ]);
    }
}
