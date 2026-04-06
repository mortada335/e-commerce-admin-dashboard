<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\CurrencyExchange;
use App\Traits\AdminCrud;

class CurrencyExchangeController extends Controller
{
    use AdminCrud;
    protected string $modelClass = CurrencyExchange::class;
}
