<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('impedimentos')) {
            return;
        }
        if (!Schema::hasColumn('impedimentos', 'resolvido')) {
            Schema::table('impedimentos', function (Blueprint $table) {
                $table->boolean('resolvido')->default(false)->after('justificativa');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('impedimentos', 'resolvido')) {
            Schema::table('impedimentos', function (Blueprint $table) {
                $table->dropColumn('resolvido');
            });
        }
    }
};
