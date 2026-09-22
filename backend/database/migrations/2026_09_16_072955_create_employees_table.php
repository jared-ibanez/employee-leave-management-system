<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('employee_number', 50)
                ->unique();

            /*
            |--------------------------------------------------------------------------
            | Personal Information
            |--------------------------------------------------------------------------
            */

            $table->string('first_name', 100);

            $table->string('middle_name', 100)
                ->nullable();

            $table->string('last_name', 100);

            $table->string('suffix', 20)
                ->nullable();

            $table->string('contact_number', 30)
                ->nullable();

            $table->date('birthdate')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Employment Information
            |--------------------------------------------------------------------------
            */

            $table->foreignId('department_id')
                ->constrained('departments')
                ->restrictOnDelete();

            $table->foreignId('supervisor_id')
                ->nullable()
                ->constrained('employees')
                ->nullOnDelete();

            $table->string('position')
                ->nullable();

            $table->date('date_hired')
                ->nullable();

            $table->string('employment_status', 30)
                ->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};