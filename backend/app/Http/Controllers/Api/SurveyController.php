<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Traits\AdminCrud;
use Illuminate\Http\JsonResponse;

class SurveyController extends Controller
{
    use AdminCrud;

    protected string $modelClass = Survey::class;
    protected array $searchFields = ['title'];
    protected array $filterFields = ['status', 'is_active'];

    public function activeSurvey(): JsonResponse
    {
        $survey = Survey::where('is_active', true)->first();
        return $this->successResponse($survey);
    }

    public function updateActiveSurvey(\Illuminate\Http\Request $request): JsonResponse
    {
        // Deactivate all, then activate the specified one
        Survey::where('is_active', true)->update(['is_active' => false]);

        if ($request->filled('survey_id')) {
            $survey = Survey::findOrFail($request->survey_id);
            $survey->update(['is_active' => true]);
            return $this->successResponse($survey->fresh());
        }

        return $this->successResponse(null, null, 200, 'Active survey cleared.');
    }
}
