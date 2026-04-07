<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('empresas')) return;

        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            $table->string('razao_social', 150);
            $table->string('nome_fantasia', 150)->nullable();
            $table->string('cnpj', 18)->unique();
            $table->string('email')->nullable();
            $table->string('telefone')->nullable();
            $table->string('responsavel_tecnico')->nullable();
            $table->double('horas_semanais_acumuladas')->default(0.0);
            $table->boolean('status_ciclo_concluido')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
