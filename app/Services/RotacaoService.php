<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Empresa;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class RotacaoService
{
    private const LIMITE_HORAS_SEMANA = 40.0;

    public function chaveSemanaAtual(): string
    {
        $n = Carbon::now();

        return sprintf('%d-W%02d', $n->isoWeekYear(), $n->isoWeek());
    }

    public function resetarContadoresSemanais(): int
    {
        $chave = $this->chaveSemanaAtual();

        return Empresa::query()->update([
            'horas_semana'              => 0,
            'horas_semanais_acumuladas' => 0,
            'deslocamento_fila'         => 0,
            'ciclo_concluido'           => false,
            'semana_referencia'         => $chave,
        ]);
    }

    private function queryMesmoSegmento(?int $segmentoId)
    {
        $q = Empresa::query();

        if ($segmentoId !== null) {
            return $q->where('segmento_id', $segmentoId);
        }

        return $q->whereNull('segmento_id');
    }

    public function garantirPosicoesFilaNoSegmento(?int $segmentoId): void
    {
        $lista = $this->queryMesmoSegmento($segmentoId)->orderBy('id')->get();

        if ($lista->isEmpty()) {
            return;
        }

        $precisa = $lista->contains(static fn (Empresa $e) => (int) $e->posicao_fila <= 0);
        if (!$precisa) {
            return;
        }

        $n = 1;
        foreach ($lista as $e) {
            if ((int) $e->posicao_fila !== $n) {
                $e->update(['posicao_fila' => $n]);
            }
            ++$n;
        }
    }

    public function garantirTodasPosicoesFila(): void
    {
        $ids = Empresa::query()->whereNotNull('segmento_id')->distinct()->pluck('segmento_id');
        foreach ($ids as $sid) {
            $this->garantirPosicoesFilaNoSegmento((int) $sid);
        }
        if (Empresa::query()->whereNull('segmento_id')->exists()) {
            $this->garantirPosicoesFilaNoSegmento(null);
        }
    }

    public function posicionarNovaEmpresaNoFim(Empresa $empresa): void
    {
        $empresa->refresh();
        $segmentoId = $empresa->segmento_id;
        $max        = (int) ($this->queryMesmoSegmento($segmentoId)
            ->where('id', '!=', $empresa->id)
            ->max('posicao_fila') ?? 0);

        $empresa->update(['posicao_fila' => $max + 1]);
    }

    public function moverParaFimDaFila(Empresa $empresa): void
    {
        $empresa->refresh();
        $segmentoId = $empresa->segmento_id;
        $p          = (int) $empresa->posicao_fila;

        $this->queryMesmoSegmento($segmentoId)
            ->where('id', '!=', $empresa->id)
            ->where('posicao_fila', '>', $p)
            ->decrement('posicao_fila');

        $novoMax = (int) ($this->queryMesmoSegmento($segmentoId)
            ->where('id', '!=', $empresa->id)
            ->max('posicao_fila') ?? 0);

        $empresa->update(['posicao_fila' => $novoMax + 1]);
    }

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
        $this->garantirPosicoesFilaNoSegmento($empresa->segmento_id);
        $empresa->refresh();

        $q = Empresa::query()
            ->where('horas_semanais_acumuladas', '<', self::LIMITE_HORAS_SEMANA);

        if ($empresa->segmento_id !== null) {
            $q->where('segmento_id', $empresa->segmento_id);
        } else {
            $q->whereNull('segmento_id');
        }

        $proxima = $q->orderBy('posicao_fila')->orderBy('id')->first();

        return $proxima !== null && (int) $proxima->id === (int) $empresa->id;
    }

    public function acumularHoras(Empresa $empresa, float $horas): void
    {
        $this->garantirPosicoesFilaNoSegmento($empresa->segmento_id);
        $empresa->refresh();

        $novaAcumulada = $empresa->horas_semanais_acumuladas + $horas;
        $novaSemana     = $empresa->horas_semana + $horas;

        if ($novaAcumulada > self::LIMITE_HORAS_SEMANA + 0.00001) {
            abort(422, 'Limite de 40 horas semanais excedido.');
        }

        $empresa->update([
            'horas_semana'              => $novaSemana,
            'horas_semanais_acumuladas' => $novaAcumulada,
        ]);

        $this->moverParaFimDaFila($empresa);
    }
}
