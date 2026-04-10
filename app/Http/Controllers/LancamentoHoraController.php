<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLancamentoHoraRequest;
use App\Services\LancamentoHoraService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LancamentoHoraController extends Controller
{
    public function __construct(
        private readonly LancamentoHoraService $lancamentoHoraService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $empresaId = $request->query('empresa_id');
        $mes       = $request->query('mes');
        $ano       = $request->query('ano');

        $lista = $this->lancamentoHoraService->listar(
            $mes !== null && $mes !== '' ? (int) $mes : null,
            $ano !== null && $ano !== '' ? (int) $ano : null,
            $empresaId !== null && $empresaId !== '' ? (int) $empresaId : null,
        );

        return response()->json($lista);
    }

    public function store(StoreLancamentoHoraRequest $request): JsonResponse
    {
        $lancamento = $this->lancamentoHoraService->registrar($request->validated());

        return response()->json($lancamento, 201);
    }
}
