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
        $q = Servico::query()->with(['segmento'])->withCount('empresas');
        $user = Auth::user();
        if ($user !== null && $user->perfil !== 'admin') {
            $q->whereHas('segmento', fn ($s) => $s->where('user_id', $user->id));
        }

        return response()->json($q->get());
    }

    public function store(StoreServicoRequest $request): JsonResponse
    {
        $d       = $request->validated();
        $servico = Servico::create([
            'segmento_id' => $d['segmento_id'],
            'nome'        => $d['nome'],
            'horas'       => isset($d['horas']) ? (float) $d['horas'] : 0.0,
        ]);

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
            'nome'  => ['sometimes', 'string', 'max:150'],
            'horas' => ['sometimes', 'numeric', 'min:0'],
        ]);

        if (array_key_exists('horas', $data)) {
            $data['horas'] = (float) $data['horas'];
        }

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
