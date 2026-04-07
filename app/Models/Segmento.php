<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Segmento extends Model
{
    protected $table = 'segmentos';

    protected $fillable = ['nome'];

    public function empresas(): HasMany
    {
        return $this->hasMany(Empresa::class);
    }
}
