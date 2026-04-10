<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Empresa;
use App\Models\LancamentoHora;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LancamentoHoraService
{
    public function __construct(
        private readonly RotacaoService $rotacaoService
    ) {}

    public function registrar(array $dados): LancamentoHora
    {
        return DB::transaction(function () use ($dados) {
            $empresa = Empresa::findOrFail($dados['empresa_id']);
            $horas   = (float) $dados['horas'];

            $empresa->refresh();

            if ($empresa->horas_semanais_acumuladas + $horas > 40.00001) {
                abort(422, 'Limite de 40 horas semanais excedido.');
            }

            if (!$this->rotacaoService->validarVez($empresa)) {
                abort(422, 'Empresa não está na vez da fila.');
            }

            $lancamento = LancamentoHora::create([
                'empresa_id' => $empresa->id,
                'usuario_id' => Auth::id(),
                'data'       => $dados['data'],
                'horas'      => $dados['horas'],
                'servico'    => $dados['servico'] ?? null,
            ]);

            AuditLog::create([
                'user_id'     => Auth::id(),
                'acao'        => 'store',
                'tabela'      => 'lancamentos_horas',
                'registro_id' => $lancamento->id,
            ]);

            $this->rotacaoService->acumularHoras($empresa, $horas);

            return $lancamento;
        });
    }

    public function listar(?int $mes, ?int $ano, ?int $empresaId): Collection
    {
        $q = LancamentoHora::query()->with(['empresa.segmento', 'usuario'])->orderByDesc('data');

        if ($empresaId !== null) {
            $q->where('empresa_id', $empresaId);
        } elseif ($mes !== null && $ano !== null) {
            $q->whereMonth('data', $mes)->whereYear('data', $ano);
        }

        return $q->get();
    }
}
