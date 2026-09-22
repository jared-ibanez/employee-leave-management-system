<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')
                ->constrained('employees')
                ->restrictOnDelete();

            $table->foreignId('leave_type_id')
                ->constrained('leave_types')
                ->restrictOnDelete();

            $table->unsignedSmallInteger('year');

            $table->decimal('entitlement_days', 6, 2)
                ->default(0);

            $table->decimal('carried_forward_days', 6, 2)
                ->default(0);

            $table->decimal('adjustment_days', 6, 2)
                ->default(0);

            $table->decimal('used_days', 6, 2)
                ->default(0);

            $table->timestamps();

            $table->unique(
                ['employee_id', 'leave_type_id', 'year'],
                'employee_leave_type_year_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};