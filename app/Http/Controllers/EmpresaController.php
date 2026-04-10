<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmpresaRequest;
use App\Models\Empresa;
use App\Services\EmpresaService;
use App\Services\RotacaoService;
use Illuminate\Http\JsonResponse;

/**
 * Equivalente ao @RestController EmpresaController do Spring Boot.
 * Rotas mapeadas em routes/api.php sob o prefixo /api/empresas.
 */
class EmpresaController extends Controller
{
    public function __construct(
        private readonly EmpresaService $empresaService,
        private readonly RotacaoService $rotacaoService
    ) {}

    /**
     * GET /api/empresas
     * Equivalente ao @GetMapping do Spring — retorna 200 OK.
     */
    public function index(): JsonResponse
    {
        $this->rotacaoService->garantirTodasPosicoesFila();

        return response()->json($this->empresaService->listarTodas());
    }

    public function show(Empresa $empresa): JsonResponse
    {
        $this->rotacaoService->garantirPosicoesFilaNoSegmento($empresa->segmento_id);
        $empresa->refresh();

        return response()->json($empresa->load('segmento'));
    }

    /**
     * POST /api/empresas
     * Equivalente ao @PostMapping do Spring — retorna 201 Created.
     */
    public function store(StoreEmpresaRequest $request): JsonResponse
    {
        $empresa = $this->empresaService->salvar($request->validated());

        return response()->json($empresa, 201);
    }

    public function destroy(Empresa $empresa): JsonResponse
    {
        $this->empresaService->remover($empresa);

        return response()->json(null, 204);
    }
}
