<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->unsignedInteger('posicao_fila')->default(0)->after('id');
            $table->decimal('horas_semana', 5, 2)->default(0)->after('posicao_fila');
            $table->boolean('ciclo_concluido')->default(false)->after('horas_semana');
        });
    }

    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn(['posicao_fila', 'horas_semana', 'ciclo_concluido']);
        });
    }
};
