<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Traits\AdminCrud;

class AuditLogAdminController extends Controller
{
    use AdminCrud;
    protected string $modelClass = AuditLog::class;
    protected array $searchFields = ['username', 'url'];
    protected array $filterFields = ['user_id', 'action', 'model_type'];
}
