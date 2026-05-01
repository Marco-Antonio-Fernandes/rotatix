<?php

namespace App\Providers;

use App\Models\Empresa;
use App\Models\Segmento;
use App\Models\Servico;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Route::bind('empresa', function (string $value): Empresa {
            $q = Empresa::whereKey($value);
            $user = Auth::user();
            if ($user !== null && $user->perfil !== 'admin') {
                $q->whereHas('segmento', fn ($s) => $s->where('user_id', $user->id));
            }

            return $q->firstOrFail();
        });

        Route::bind('segmento', function (string $value): Segmento {
            $q = Segmento::whereKey($value);
            $user = Auth::user();
            if ($user !== null && $user->perfil !== 'admin') {
                $q->where('user_id', $user->id);
            }

            return $q->firstOrFail();
        });

        Route::bind('servico', function (string $value): Servico {
            $q = Servico::whereKey($value);
            $user = Auth::user();
            if ($user !== null && $user->perfil !== 'admin') {
                $q->whereHas('segmento', fn ($s) => $s->where('user_id', $user->id));
            }

            return $q->firstOrFail();
        });
    }
}
