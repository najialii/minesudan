<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('serial_number')->unique();
            $table->enum('type', ['refining', 'melting', 'casting', 'other'])->default('refining');
            $table->enum('status', ['active', 'maintenance', 'inactive'])->default('active');
            $table->decimal('cost_per_unit', 10, 2)->default(0);
            $table->string('unit')->default('hour');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};
