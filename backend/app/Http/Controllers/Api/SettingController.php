<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::orderBy('group')->orderBy('key')->get()
            ->groupBy('group')
            ->map(fn ($group) => $group->mapWithKeys(fn ($s) => [$s->key => [
                'value' => $s->value,
                'type'  => $s->type,
                'label' => $s->label,
            ]]));

        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate(['settings' => 'required|array']);

        foreach ($request->settings as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Settings updated successfully.']);
    }
}
