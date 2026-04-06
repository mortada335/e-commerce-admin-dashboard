<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use App\Traits\AdminCrud;

class HomeSectionController extends Controller
{
    use AdminCrud;
    protected string $modelClass = HomeSection::class;
    protected array $searchFields = ['title', 'title_ar'];
    protected array $filterFields = ['status', 'section_type'];
}
