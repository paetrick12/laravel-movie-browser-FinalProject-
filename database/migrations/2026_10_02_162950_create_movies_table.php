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
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->uuid('ghibli_id')->unique();
            $table->string('title');
            $table->string('original_title')->nullable();
            $table->text('description');
            $table->string('director');
            $table->string('producer');
            $table->unsignedSmallInteger('release_date');
            $table->unsignedSmallInteger('running_time');
            $table->unsignedTinyInteger('rt_score');
            $table->text('image')->nullable();
            $table->text('movie_banner')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
