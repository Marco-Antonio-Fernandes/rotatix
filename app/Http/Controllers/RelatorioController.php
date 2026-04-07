<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Impedimento;
use App\Models\LancamentoHora;
use App\Models\Servico;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RelatorioController extends Controller
{
    public function prestadoresPorCategoria(): JsonResponse
    {
        $dados = Empresa::with('segmento')
            ->get()
            ->groupBy(fn($e) => $e->segmento?->nome ?? 'Sem categoria');

        return response()->json($dados);
    }

    public function catalogoServicos(): JsonResponse
    {
        return response()->json(Servico::with('segmento')->get());
    }

    public function statusRotacao(): JsonResponse
    {
        return response()->json(
            Empresa::orderBy('posicao_fila')->get(['id', 'razao_social', 'posicao_fila', 'horas_semana', 'ciclo_concluido'])
        );
    }

    public function impedimentos(): JsonResponse
    {
        return response()->json(
            Impedimento::with(['empresa', 'usuario'])->orderByDesc('data')->get()
        );
    }

    public function consolidadoMensal(Request $request): JsonResponse
    {
        $mes = $request->query('mes', now()->format('Y-m'));

        $dados = LancamentoHora::with('empresa')
            ->whereRaw('DATE_FORMAT(data, "%Y-%m") = ?', [$mes])
            ->get()
            ->groupBy('empresa_id')
            ->map(fn($lancamentos) => [
                'empresa'    => $lancamentos->first()->empresa,
                'total_horas' => $lancamentos->sum('horas'),
            ])
            ->values();

        return response()->json($dados);
    }
}
