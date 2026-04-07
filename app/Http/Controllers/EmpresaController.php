<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmpresaRequest;
use App\Services\EmpresaService;
use Illuminate\Http\JsonResponse;

/**
 * Equivalente ao @RestController EmpresaController do Spring Boot.
 * Rotas mapeadas em routes/api.php sob o prefixo /api/empresas.
 */
class EmpresaController extends Controller
{
    public function __construct(
        private readonly EmpresaService $empresaService
    ) {}

    /**
     * GET /api/empresas
     * Equivalente ao @GetMapping do Spring — retorna 200 OK.
     */
    public function index(): JsonResponse
    {
        return response()->json($this->empresaService->listarTodas());
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
}
