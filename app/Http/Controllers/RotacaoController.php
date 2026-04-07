<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\RotacaoService;
use Illuminate\Http\JsonResponse;

class RotacaoController extends Controller
{
    public function __construct(
        private readonly RotacaoService $rotacaoService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->rotacaoService->fila());
    }

    public function ativa(): JsonResponse
    {
        return response()->json($this->rotacaoService->empresaAtiva());
    }
}
