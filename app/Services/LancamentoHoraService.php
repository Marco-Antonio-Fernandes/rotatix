<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Empresa;
use App\Models\LancamentoHora;
use Illuminate\Support\Facades\Auth;

class LancamentoHoraService
{
    public function __construct(
        private readonly RotacaoService $rotacaoService
    ) {}

    public function registrar(array $dados): LancamentoHora
    {
        $empresa = Empresa::findOrFail($dados['empresa_id']);

        if (!$this->rotacaoService->validarVez($empresa)) {
            abort(422, 'Empresa não está na vez da fila.');
        }

        $lancamento = LancamentoHora::create([
            'empresa_id' => $empresa->id,
            'usuario_id' => Auth::id(),
            'data'       => $dados['data'],
            'horas'      => $dados['horas'],
        ]);

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'lancamentos_horas',
            'registro_id' => $lancamento->id,
        ]);

        $this->rotacaoService->acumularHoras($empresa, (float) $dados['horas']);

        return $lancamento;
    }
}
