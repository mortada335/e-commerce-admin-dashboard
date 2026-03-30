<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Banner::with('products');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return $query->orderBy('sort_order')->orderByDesc('created_at')->paginate($request->get('per_page', 15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'image'          => 'required|image|max:2048',
            'link'           => 'nullable|string|max:255',
            'target'         => 'required|string|in:_self,_blank',
            'is_active'      => 'boolean',
            'sort_order'     => 'integer',
            'banner_type'    => 'nullable|string|max:50',
            'banner_type_id' => 'nullable|string|max:50',
            'event_date'     => 'nullable|date',
            'event_date_end' => 'nullable|date|after_or_equal:event_date',
            'event_title'    => 'nullable|string|max:255',
            'product_ids'    => 'nullable|array',
            'product_ids.*'  => 'integer|exists:products,id',
        ]);

        $productIds = $validated['product_ids'] ?? [];
        unset($validated['product_ids']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner = Banner::create($validated);

        if (!empty($productIds)) {
            $banner->products()->sync($productIds);
        }

        return response()->json($banner->load('products'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        $banner->load('products');
        return response()->json($banner);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title'          => 'sometimes|required|string|max:255',
            'image'          => 'nullable|image|max:2048',
            'link'           => 'nullable|string|max:255',
            'target'         => 'sometimes|required|string|in:_self,_blank',
            'is_active'      => 'boolean',
            'sort_order'     => 'integer',
            'banner_type'    => 'nullable|string|max:50',
            'banner_type_id' => 'nullable|string|max:50',
            'event_date'     => 'nullable|date',
            'event_date_end' => 'nullable|date|after_or_equal:event_date',
            'event_title'    => 'nullable|string|max:255',
            'product_ids'    => 'nullable|array',
            'product_ids.*'  => 'integer|exists:products,id',
        ]);

        $productIds = $validated['product_ids'] ?? null;
        unset($validated['product_ids']);

        if ($request->hasFile('image')) {
            if ($banner->image) Storage::disk('public')->delete($banner->image);
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        if ($productIds !== null) {
            $banner->products()->sync($productIds);
        }

        return response()->json($banner->load('products'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        if ($banner->image) Storage::disk('public')->delete($banner->image);
        $banner->delete();

        return response()->noContent();
    }
}
