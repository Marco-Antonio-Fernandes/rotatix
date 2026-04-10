<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Impedimento extends Model
{
    protected $table = 'impedimentos';

    protected $fillable = [
        'empresa_id',
        'usuario_id',
        'data',
        'justificativa',
        'resolvido',
    ];

    protected $casts = [
        'data'     => 'date',
        'resolvido' => 'boolean',
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
