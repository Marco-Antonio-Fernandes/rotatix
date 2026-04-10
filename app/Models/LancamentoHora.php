<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LancamentoHora extends Model
{
    protected $table = 'lancamentos_horas';

    protected $fillable = [
        'empresa_id',
        'usuario_id',
        'data',
        'horas',
        'servico',
    ];

    protected $casts = [
        'data'  => 'date',
        'horas' => 'float',
    ];

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
