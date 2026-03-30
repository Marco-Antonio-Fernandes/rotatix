<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// A rota raiz agora aponta para o Dashboard, exigindo autenticação
Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard'); // A rota 'dashboard' agora está associada à raiz

// Se você tinha uma rota '/dashboard' separada, ela foi integrada acima.
// Se quiser um alias ou outra forma de acessar, pode criar uma nova rota com outro nome.

Route::get('/empresas', function () {
    return Inertia::render('Empresas/Index');
})->middleware(['auth', 'verified'])->name('empresas.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';