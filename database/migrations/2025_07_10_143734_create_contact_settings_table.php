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
        Schema::create('contact_settings', function (Blueprint $table) {
            $table->id();
            $table->string('whatsapp1')->nullable();
            $table->string('whatsapp1_label')->default('WhatsApp 1');
            $table->string('whatsapp2')->nullable();
            $table->string('whatsapp2_label')->default('WhatsApp 2');
            $table->string('email')->nullable();
            $table->string('email_label')->default('Email Us');
            $table->text('map_embed')->nullable();
            $table->text('contact_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_settings');
    }
};
