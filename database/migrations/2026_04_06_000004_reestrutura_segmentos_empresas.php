<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Remove empresa_id de segmentos (segmento passa a ser categoria independente)
        Schema::table('segmentos', function (Blueprint $table) {
            if (collect(DB::select("SHOW KEYS FROM segmentos WHERE Key_name = 'segmentos_empresa_id_foreign'"))->isNotEmpty()) {
                $table->dropForeign(['empresa_id']);
            }
            if (Schema::hasColumn('segmentos', 'empresa_id')) {
                $table->dropColumn('empresa_id');
            }
        });

        // Adiciona segmento_id em empresas (empresa pertence a um segmento)
        Schema::table('empresas', function (Blueprint $table) {
            $table->foreignId('segmento_id')
                ->nullable()
                ->constrained('segmentos')
                ->nullOnDelete()
                ->after('status_ciclo_concluido');
        });
    }

    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropForeign(['segmento_id']);
            $table->dropColumn('segmento_id');
        });

        Schema::table('segmentos', function (Blueprint $table) {
            $table->foreignId('empresa_id')->constrained('empresas')->cascadeOnDelete()->after('id');
        });
    }
};
