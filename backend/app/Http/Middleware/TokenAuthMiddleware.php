<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Accepts both "Token <key>" and "Bearer <key>" Authorization header formats.
 * Normalizes "Token <key>" to "Bearer <key>" so Sanctum can handle it.
 */
class TokenAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $auth = $request->header('Authorization', '');

        if (str_starts_with($auth, 'Token ')) {
            $token = substr($auth, 6);
            $request->headers->set('Authorization', 'Bearer ' . trim($token));
        } elseif (!empty($auth) && !str_starts_with($auth, 'Bearer ') && !str_starts_with($auth, 'Basic ')) {
            // Assume it is a bare token
            $request->headers->set('Authorization', 'Bearer ' . trim($auth));
        }

        return $next($request);
    }
}
