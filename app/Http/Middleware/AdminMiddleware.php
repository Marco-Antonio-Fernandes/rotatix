<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->perfil !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        return $next($request);
    }
}
