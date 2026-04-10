<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('/', 'app')->name('dashboard');
    Route::view('/empresas', 'app')->name('empresas.index');
    Route::view('/empresas/criar', 'app')->name('empresas.create');
    Route::view('/empresas/{id}', 'app')->name('empresas.show');
    Route::view('/empresas/{id}/vinculos', 'app')->name('empresas.vinculos');
    Route::view('/servicos', 'app')->name('servicos.index');
    Route::view('/servicos/criar', 'app')->name('servicos.create');
    Route::view('/lancamento-horas/criar', 'app')->name('lancamento-horas.create');
    Route::view('/impedimentos', 'app')->name('impedimentos.index');
    Route::view('/impedimentos/criar', 'app')->name('impedimentos.create');
    Route::view('/usuarios', 'app')->name('usuarios.index');
    Route::view('/usuarios/criar', 'app')->name('usuarios.create');
    Route::view('/relatorios', 'app')->name('relatorios.index');
    Route::view('/ajuda', 'app')->name('ajuda.index');
});

Route::middleware('auth')->group(function () {
    Route::view('/profile', 'app')->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::view('/{any?}', 'app')->where('any', '.*');
