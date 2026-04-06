<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Popup;
use App\Traits\AdminCrud;

class PopupController extends Controller
{
    use AdminCrud;
    protected string $modelClass = Popup::class;
    protected array $searchFields = ['name'];
    protected array $filterFields = ['status', 'type'];
}
