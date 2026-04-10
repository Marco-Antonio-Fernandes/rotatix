<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lancamentos_horas')) {
            return;
        }

        if (!Schema::hasColumn('lancamentos_horas', 'servico')) {
            Schema::table('lancamentos_horas', function (Blueprint $table) {
                $table->string('servico', 255)->nullable()->after('horas');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('lancamentos_horas')) {
            return;
        }

        if (Schema::hasColumn('lancamentos_horas', 'servico')) {
            Schema::table('lancamentos_horas', function (Blueprint $table) {
                $table->dropColumn('servico');
            });
        }
    }
};
