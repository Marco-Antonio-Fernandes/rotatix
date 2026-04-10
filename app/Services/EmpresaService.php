<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Empresa;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class EmpresaService
{
    public function __construct(
        private readonly RotacaoService $rotacaoService
    ) {}

    private const PADRAO_CRIACAO = [
        'horas_semanais_acumuladas' => 0,
        'deslocamento_fila'         => 0,
        'status_ciclo_concluido'    => false,
        'posicao_fila'              => 0,
        'horas_semana'              => 0,
        'ciclo_concluido'           => false,
    ];

    /**
     * Persiste uma nova empresa ou atualiza uma existente.
     * Equivalente ao EmpresaService.salvar() do Spring Boot.
     */
    public function salvar(array $dados): Empresa
    {
        // Placeholder: futuramente validar regras de negócio aqui
        // Ex: if ($dados['horas_semanais_acumuladas'] > 40) { throw ... }

        $empresa = Empresa::create(array_merge(self::PADRAO_CRIACAO, $dados, [
            'semana_referencia' => $this->rotacaoService->chaveSemanaAtual(),
        ]));

        $this->rotacaoService->posicionarNovaEmpresaNoFim($empresa);

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'empresas',
            'registro_id' => $empresa->id,
        ]);

        return $empresa;
    }

    /**
     * Retorna todas as empresas cadastradas.
     * Equivalente ao EmpresaService.listarTodas() do Spring Boot.
     *
     * @return Collection<int, Empresa>
     */
    public function listarTodas(): Collection
    {
        return Empresa::all();
    }

    public function remover(Empresa $empresa): void
    {
        $id = $empresa->id;
        $empresa->delete();

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'destroy',
            'tabela'      => 'empresas',
            'registro_id' => $id,
        ]);
    }
}
