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

        if (!Schema::hasColumn('empresas', 'created_at')) {
            Schema::table('empresas', function (Blueprint $table) {
                $table->timestamp('created_at')->nullable();
            });
        }
        if (!Schema::hasColumn('empresas', 'updated_at')) {
            Schema::table('empresas', function (Blueprint $table) {
                $table->timestamp('updated_at')->nullable();
            });
        }
    }

    public function down(): void {}
};
