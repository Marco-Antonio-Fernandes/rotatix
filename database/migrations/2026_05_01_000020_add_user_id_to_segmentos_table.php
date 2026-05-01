<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('segmentos', 'user_id')) {
            Schema::table('segmentos', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            });
        }

        $ownerId = DB::table('users')->orderBy('id')->value('id');
        if ($ownerId !== null) {
            DB::table('segmentos')->whereNull('user_id')->update(['user_id' => $ownerId]);
        }
    }

    public function down(): void
    {
        Schema::table('segmentos', function (Blueprint $table) {
            if (!Schema::hasColumn('segmentos', 'user_id')) {
                return;
            }
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
