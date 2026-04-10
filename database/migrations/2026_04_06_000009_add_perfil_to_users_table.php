<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'perfil')) return;

        Schema::table('users', function (Blueprint $table) {
            $table->enum('perfil', ['admin', 'operador'])->default('operador')->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('perfil');
        });
    }
};
