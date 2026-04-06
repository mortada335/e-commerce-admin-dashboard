<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\BackendLog;
use App\Traits\AdminCrud;

class BackendLogController extends Controller
{
    use AdminCrud;
    protected string $modelClass = BackendLog::class;
    protected array $filterFields = ['level', 'channel'];
}
