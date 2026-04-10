<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('empresas')) {
            return;
        }
        if (!Schema::hasColumn('empresas', 'semana_referencia')) {
            Schema::table('empresas', function (Blueprint $table) {
                $table->string('semana_referencia', 16)->nullable()->after('deslocamento_fila');
            });
        }
        $n     = Carbon::now();
        $chave = sprintf('%d-W%02d', $n->isoWeekYear(), $n->isoWeek());
        DB::table('empresas')->whereNull('semana_referencia')->update(['semana_referencia' => $chave]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('empresas', 'semana_referencia')) {
            Schema::table('empresas', function (Blueprint $table) {
                $table->dropColumn('semana_referencia');
            });
        }
    }
};
