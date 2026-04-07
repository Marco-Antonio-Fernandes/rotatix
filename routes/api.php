<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\ImpedimentoController;
use App\Http\Controllers\LancamentoHoraController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\RotacaoController;
use App\Http\Controllers\SegmentoController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('empresas', [EmpresaController::class, 'index']);
    Route::get('segmentos', [SegmentoController::class, 'index']);
    Route::get('impedimentos', [ImpedimentoController::class, 'index']);
    Route::get('rotacao', [RotacaoController::class, 'index']);
    Route::get('rotacao/ativa', [RotacaoController::class, 'ativa']);
    Route::get('relatorios/prestadores-por-categoria', [RelatorioController::class, 'prestadoresPorCategoria']);
    Route::get('relatorios/catalogo-servicos', [RelatorioController::class, 'catalogoServicos']);
    Route::get('relatorios/status-rotacao', [RelatorioController::class, 'statusRotacao']);
    Route::get('relatorios/impedimentos', [RelatorioController::class, 'impedimentos']);
    Route::get('relatorios/consolidado-mensal', [RelatorioController::class, 'consolidadoMensal']);

    Route::middleware('operador')->group(function () {
        Route::post('empresas', [EmpresaController::class, 'store']);

        Route::post('segmentos', [SegmentoController::class, 'store']);
        Route::delete('segmentos/{segmento}', [SegmentoController::class, 'destroy']);

        Route::get('servicos', [ServicoController::class, 'index']);
        Route::post('servicos', [ServicoController::class, 'store']);
        Route::patch('servicos/{servico}', [ServicoController::class, 'update']);
        Route::delete('servicos/{servico}', [ServicoController::class, 'destroy']);

        Route::post('lancamento-horas', [LancamentoHoraController::class, 'store']);
        Route::get('lancamento-horas', [LancamentoHoraController::class, 'index']);

        Route::post('impedimentos', [ImpedimentoController::class, 'store']);
        Route::patch('impedimentos/{impedimento}', [ImpedimentoController::class, 'update']);
    });

    Route::middleware('admin')->group(function () {
        Route::get('audit-logs', [AuditLogController::class, 'index']);
        Route::get('usuarios', [UserController::class, 'index']);
        Route::post('usuarios', [UserController::class, 'store']);
        Route::delete('usuarios/{user}', [UserController::class, 'destroy']);
    });
});
