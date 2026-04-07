<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OperadorMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!in_array($request->user()?->perfil, ['admin', 'operador'], true)) {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        return $next($request);
    }
}
