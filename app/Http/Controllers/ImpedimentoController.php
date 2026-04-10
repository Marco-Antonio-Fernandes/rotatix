<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreImpedimentoRequest;
use App\Models\Impedimento;
use App\Services\ImpedimentoService;
use Illuminate\Http\JsonResponse;

class ImpedimentoController extends Controller
{
    public function __construct(
        private readonly ImpedimentoService $impedimentoService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->impedimentoService->listar());
    }

    public function store(StoreImpedimentoRequest $request): JsonResponse
    {
        $impedimento = $this->impedimentoService->registrar($request->validated());

        return response()->json($impedimento, 201);
    }
}
