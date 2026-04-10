<?php

use App\Models\Empresa;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('empresas')) {
            return;
        }

        DB::transaction(function (): void {
            $segmentos = Empresa::query()->whereNotNull('segmento_id')->distinct()->pluck('segmento_id');
            foreach ($segmentos as $sid) {
                $this->renumerarSegmento(function ($q) use ($sid) {
                    $q->where('segmento_id', $sid);
                });
            }
            if (Empresa::query()->whereNull('segmento_id')->exists()) {
                $this->renumerarSegmento(fn ($q) => $q->whereNull('segmento_id'));
            }
        });
    }

    /**
     * @param  callable(\Illuminate\Database\Eloquent\Builder): void  $escopo
     */
    private function renumerarSegmento(callable $escopo): void
    {
        $q = Empresa::query();
        $escopo($q);
        $lista = $q->orderBy('id')->get();
        $n     = 1;
        foreach ($lista as $e) {
            if ((int) $e->posicao_fila !== $n) {
                $e->update(['posicao_fila' => $n]);
            }
            ++$n;
        }
    }

    public function down(): void {}
};
