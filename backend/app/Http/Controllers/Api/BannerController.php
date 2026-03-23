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
        $query = Banner::query();

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
            'title' => 'required|string|max:255',
            'image' => 'required|image|max:2048',
            'link' => 'nullable|string|max:255',
            'target' => 'required|string|in:_self,_blank',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner = Banner::create($validated);

        return response()->json($banner, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        return response()->json($banner);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'link' => 'nullable|string|max:255',
            'target' => 'sometimes|required|string|in:_self,_blank',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image) Storage::disk('public')->delete($banner->image);
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        return response()->json($banner);
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
