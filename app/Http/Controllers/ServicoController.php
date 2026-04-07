<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreServicoRequest;
use App\Models\AuditLog;
use App\Models\Servico;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServicoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Servico::withCount('empresas')->get());
    }

    public function store(StoreServicoRequest $request): JsonResponse
    {
        $servico = Servico::create($request->validated());

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'servicos',
            'registro_id' => $servico->id,
        ]);

        return response()->json($servico, 201);
    }

    public function update(Request $request, Servico $servico): JsonResponse
    {
        $data = $request->validate([
            'nome'      => ['sometimes', 'string', 'max:150'],
            'descricao' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        $servico->update($data);

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'update',
            'tabela'      => 'servicos',
            'registro_id' => $servico->id,
        ]);

        return response()->json($servico);
    }

    public function destroy(Servico $servico): JsonResponse
    {
        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'destroy',
            'tabela'      => 'servicos',
            'registro_id' => $servico->id,
        ]);

        $servico->delete();

        return response()->json(null, 204);
    }
}
