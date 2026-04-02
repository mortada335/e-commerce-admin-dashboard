<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $settings = Setting::orderBy('group')->orderBy('key')->get()
            ->groupBy('group')
            ->map(fn ($group) => $group->mapWithKeys(fn ($s) => [$s->key => [
                'value' => $s->value,
                'type'  => $s->type,
                'label' => $s->label,
            ]]));

        return $this->successResponse($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable',
        ]);

        $oldValues = [];
        $newValues = [];

        foreach ($request->settings as $key => $value) {
            $setting = Setting::where('key', $key)->first();
            if (!$setting) continue;

            // Type-based validation
            if ($setting->type === 'boolean' && !is_bool($value) && !in_array($value, [0, 1, '0', '1', true, false], true)) {
                return $this->errorResponse('VALIDATION_ERROR', "Setting '{$key}' must be a boolean value.", null, 422);
            }
            if ($setting->type === 'number' && !is_numeric($value)) {
                return $this->errorResponse('VALIDATION_ERROR', "Setting '{$key}' must be a numeric value.", null, 422);
            }

            $oldValues[$key] = $setting->value;
            $newValues[$key] = $value;
            Setting::set($key, $value);
        }

        if (!empty($newValues)) {
            ActivityLog::record('settings_updated', null, $oldValues, $newValues);
        }

        return $this->successResponse(null, null, 200, 'Settings updated successfully.');
    }
}
