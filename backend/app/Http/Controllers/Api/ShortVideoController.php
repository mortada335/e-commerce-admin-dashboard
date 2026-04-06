<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ShortVideo;
use App\Traits\AdminCrud;

class ShortVideoController extends Controller
{
    use AdminCrud;
    protected string $modelClass = ShortVideo::class;
    protected array $filterFields = ['status', 'product_id'];
}
