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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_register_id');
            $table->string('activity_name');
            $table->decimal('distance', 8, 2); // Distance in kilometers
            $table->integer('duration'); // Duration in total seconds
            $table->integer('pace'); // Pace in total seconds per kilometer
            $table->string('strava_url');
            $table->date('date');
            $table->timestamps();

            $table->foreign('event_register_id')->references('id')->on('event_registers')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
