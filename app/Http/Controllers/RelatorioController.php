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
        $q = Empresa::with('segmento');
        $user = Auth::user();
        if ($user !== null && $user->perfil !== 'admin') {
            $q->whereHas('segmento', fn ($s) => $s->where('user_id', $user->id));
        }

        $dados = $q->get()->groupBy(fn ($e) => $e->segmento?->nome ?? 'Sem categoria');

        return response()->json($dados);
    }

    public function catalogoServicos(): JsonResponse
    {
        $q = Servico::with('segmento');
        $user = Auth::user();
        if ($user !== null && $user->perfil !== 'admin') {
            $q->whereHas('segmento', fn ($s) => $s->where('user_id', $user->id));
        }

        return response()->json($q->get());
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
        $q = Impedimento::with(['empresa', 'usuario'])->orderByDesc('data');
        $user = Auth::user();
        if ($user !== null && $user->perfil !== 'admin') {
            $q->whereHas('empresa.segmento', fn ($s) => $s->where('user_id', $user->id));
        }

        return response()->json($q->get());
    }

    public function consolidadoMensal(Request $request): JsonResponse
    {
        $mes = $request->query('mes', now()->format('Y-m'));

        $q = LancamentoHora::with('empresa')
            ->whereRaw('DATE_FORMAT(data, "%Y-%m") = ?', [$mes]);
        $user = Auth::user();
        if ($user !== null && $user->perfil !== 'admin') {
            $q->whereHas('empresa.segmento', fn ($s) => $s->where('user_id', $user->id));
        }

        $dados = $q->get()
            ->groupBy('empresa_id')
            ->map(fn($lancamentos) => [
                'empresa'    => $lancamentos->first()->empresa,
                'total_horas' => $lancamentos->sum('horas'),
            ])
            ->values();

        return response()->json($dados);
    }
}
