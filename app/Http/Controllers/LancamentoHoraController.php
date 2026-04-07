<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLancamentoHoraRequest;
use App\Services\LancamentoHoraService;
use Illuminate\Http\JsonResponse;

class LancamentoHoraController extends Controller
{
    public function __construct(
        private readonly LancamentoHoraService $lancamentoHoraService
    ) {}

    public function store(StoreLancamentoHoraRequest $request): JsonResponse
    {
        $lancamento = $this->lancamentoHoraService->registrar($request->validated());

        return response()->json($lancamento, 201);
    }
}
