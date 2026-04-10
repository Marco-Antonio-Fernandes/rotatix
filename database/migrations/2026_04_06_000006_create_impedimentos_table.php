<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('impedimentos')) return;

        Schema::create('impedimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas')->cascadeOnDelete();
            $table->foreignId('usuario_id')->constrained('users')->cascadeOnDelete();
            $table->date('data');
            $table->text('justificativa');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impedimentos');
    }
};
