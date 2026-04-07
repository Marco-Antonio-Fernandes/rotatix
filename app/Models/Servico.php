<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Servico extends Model
{
    protected $table = 'servicos';

    protected $fillable = ['segmento_id', 'nome', 'horas'];

    protected $casts = ['horas' => 'float'];

    public function segmento(): BelongsTo
    {
        return $this->belongsTo(Segmento::class);
    }
}
