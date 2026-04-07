<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreImpedimentoRequest;
use App\Http\Requests\UpdateImpedimentoRequest;
use App\Models\AuditLog;
use App\Models\Impedimento;
use App\Services\ImpedimentoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

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

    public function update(UpdateImpedimentoRequest $request, Impedimento $impedimento): JsonResponse
    {
        $impedimento->update($request->validated());

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'update',
            'tabela'      => 'impedimentos',
            'registro_id' => $impedimento->id,
        ]);

        return response()->json($impedimento);
    }
}
