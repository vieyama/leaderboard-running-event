<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First add columns as nullable
        Schema::table('events', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('status');
            $table->date('end_date')->nullable()->after('start_date');
        });
        
        // Then update existing records with default dates
        \DB::table('events')->update([
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDays(7)->toDateString()
        ]);
        
        // Finally make the columns required
        Schema::table('events', function (Blueprint $table) {
            $table->date('start_date')->nullable(false)->change();
            $table->date('end_date')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
        });
    }
};
