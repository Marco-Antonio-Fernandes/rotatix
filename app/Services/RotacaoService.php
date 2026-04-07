<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Empresa;
use Illuminate\Database\Eloquent\Collection;

class RotacaoService
{
    public function fila(): Collection
    {
        return Empresa::orderBy('posicao_fila')->get();
    }

    public function empresaAtiva(): ?Empresa
    {
        return Empresa::where('posicao_fila', 1)->first();
    }

    public function validarVez(Empresa $empresa): bool
    {
        return $empresa->posicao_fila === 1;
    }

    public function concluirCiclo(Empresa $empresa): void
    {
        $ultima = Empresa::max('posicao_fila');

        $empresa->update([
            'ciclo_concluido' => true,
            'horas_semana'    => 0,
            'posicao_fila'    => $ultima + 1,
        ]);

        Empresa::where('posicao_fila', '>', 1)
            ->where('id', '!=', $empresa->id)
            ->decrement('posicao_fila');
    }

    public function acumularHoras(Empresa $empresa, float $horas): void
    {
        $novasHoras = $empresa->horas_semana + $horas;

        $empresa->update(['horas_semana' => $novasHoras]);

        if ($novasHoras >= 40) {
            $this->concluirCiclo($empresa);
        }
    }
}
