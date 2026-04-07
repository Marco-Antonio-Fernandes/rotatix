<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $fillable = [
        'razao_social',
        'nome_fantasia',
        'cnpj',
        'email',
        'telefone',
        'responsavel_tecnico',
        'horas_semanais_acumuladas',
        'status_ciclo_concluido',
        'segmento_id',
        'posicao_fila',
        'horas_semana',
        'ciclo_concluido',
    ];

    protected $casts = [
        'horas_semanais_acumuladas' => 'float',
        'status_ciclo_concluido'    => 'boolean',
        'segmento_id'               => 'integer',
        'posicao_fila'              => 'integer',
        'horas_semana'              => 'float',
        'ciclo_concluido'           => 'boolean',
    ];

    public function segmento(): BelongsTo
    {
        return $this->belongsTo(Segmento::class);
    }

    public function lancamentosHoras(): HasMany
    {
        return $this->hasMany(LancamentoHora::class);
    }

    public function servicos(): BelongsToMany
    {
        return $this->belongsToMany(Servico::class, 'empresa_servico');
    }
}