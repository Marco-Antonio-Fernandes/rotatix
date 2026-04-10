<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('empresas')) {
            return;
        }
        if (!Schema::hasColumn('empresas', 'deslocamento_fila')) {
            Schema::table('empresas', function (Blueprint $table) {
                $table->decimal('deslocamento_fila', 10, 2)->default(0)->after('horas_semanais_acumuladas');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('empresas', 'deslocamento_fila')) {
            Schema::table('empresas', function (Blueprint $table) {
                $table->dropColumn('deslocamento_fila');
            });
        }
    }
};
