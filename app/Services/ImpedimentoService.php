<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Impedimento;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class ImpedimentoService
{
    public function listar(): Collection
    {
        return Impedimento::with(['empresa', 'usuario'])->orderByDesc('data')->get();
    }

    public function registrar(array $dados): Impedimento
    {
        $impedimento = Impedimento::create([
            'empresa_id'    => $dados['empresa_id'],
            'usuario_id'    => Auth::id(),
            'data'          => $dados['data'],
            'justificativa' => $dados['justificativa'],
            'resolvido'     => false,
        ]);

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'impedimentos',
            'registro_id' => $impedimento->id,
        ]);

        return $impedimento;
    }
}
