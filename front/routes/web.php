<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('/', 'app')->name('dashboard');
    Route::view('/empresas', 'app')->name('empresas.index');
});

Route::middleware('auth')->group(function () {
    Route::view('/profile', 'app')->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::view('/{any?}', 'app')->where('any', '.*');
