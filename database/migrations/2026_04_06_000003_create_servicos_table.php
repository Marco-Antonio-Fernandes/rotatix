<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('servicos')) return;

        Schema::create('servicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('segmento_id')->constrained('segmentos')->cascadeOnDelete();
            $table->string('nome', 150);
            $table->double('horas')->default(0.0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicos');
    }
};
