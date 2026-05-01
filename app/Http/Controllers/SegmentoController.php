<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\MarcarIndisponivelSegmentoRequest;
use App\Http\Requests\StoreSegmentoRequest;
use App\Models\AuditLog;
use App\Models\Impedimento;
use App\Models\Segmento;
use App\Services\RotacaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class SegmentoController extends Controller
{
    public function __construct(
        private readonly RotacaoService $rotacaoService
    ) {}

    public function index(): JsonResponse
    {
        if (Auth::check()) {
            $this->rotacaoService->garantirTodasPosicoesFila();
        }

        $segmentos = Segmento::with(['empresas' => function ($query) {
            $query->orderBy('posicao_fila')->orderBy('id');
        }])->get();

        return response()->json($segmentos);
    }

    public function store(StoreSegmentoRequest $request): JsonResponse
    {
        $segmento = Segmento::create($request->validated());
        $segmento->setRelation('empresas', collect());

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'segmentos',
            'registro_id' => $segmento->id,
        ]);

        return response()->json($segmento, 201);
    }

    public function indisponivel(MarcarIndisponivelSegmentoRequest $request, Segmento $segmento): JsonResponse
    {
        $this->rotacaoService->garantirPosicoesFilaNoSegmento((int) $segmento->id);

        $justificativa = $request->validated()['justificativa'];

        $empresas = $segmento->empresas()
            ->where('horas_semanais_acumuladas', '<', 40)
            ->orderBy('posicao_fila')
            ->orderBy('id')
            ->get();

        if ($empresas->isEmpty()) {
            return response()->json(['message' => 'Nenhuma empresa ativa no segmento.'], 422);
        }

        $atual = $empresas->first();

        $this->rotacaoService->moverParaFimDaFila($atual);

        Impedimento::create([
            'empresa_id'    => $atual->id,
            'usuario_id'    => Auth::id(),
            'data'          => Carbon::today(),
            'justificativa' => $justificativa,
            'resolvido'     => false,
        ]);

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'impedimentos',
            'registro_id' => $atual->id,
        ]);

        $atual->refresh();

        $empresasDepois = $segmento->empresas()
            ->where('horas_semanais_acumuladas', '<', 40)
            ->orderBy('posicao_fila')
            ->orderBy('id')
            ->get();

        $proxima = $empresasDepois->first();

        return response()->json([
            'indisponivel' => $atual,
            'proxima'      => $proxima,
        ]);
    }

    public function destroy(Segmento $segmento): JsonResponse
    {
        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'destroy',
            'tabela'      => 'segmentos',
            'registro_id' => $segmento->id,
        ]);

        $segmento->delete();

        return response()->json(null, 204);
    }
}
