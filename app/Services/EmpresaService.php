<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Empresa;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class EmpresaService
{
    /**
     * Persiste uma nova empresa ou atualiza uma existente.
     * Equivalente ao EmpresaService.salvar() do Spring Boot.
     */
    public function salvar(array $dados): Empresa
    {
        // Placeholder: futuramente validar regras de negócio aqui
        // Ex: if ($dados['horas_semanais_acumuladas'] > 40) { throw ... }

        $empresa = Empresa::create($dados);

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
}
