<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Empresa;
use App\Models\Impedimento;
use App\Models\LancamentoHora;
use App\Models\Servico;
use App\Services\RotacaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RelatorioController extends Controller
{
    public function __construct(
        private readonly RotacaoService $rotacaoService
    ) {}

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

    public function resetarSemana(): JsonResponse
    {
        $n = $this->rotacaoService->resetarContadoresSemanais();

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'reset_semana',
            'tabela'      => 'empresas',
            'registro_id' => 0,
        ]);

        return response()->json([
            'message'              => 'Contadores semanais zerados.',
            'empresas_atualizadas' => $n,
        ]);
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
