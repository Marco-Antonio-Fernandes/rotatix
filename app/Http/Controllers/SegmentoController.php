<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreSegmentoRequest;
use App\Models\AuditLog;
use App\Models\Segmento;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SegmentoController extends Controller
{
    public function index(): JsonResponse
    {
        $segmentos = Segmento::with(['empresas' => function ($query) {
            $query->orderBy('horas_semanais_acumuladas', 'asc');
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
