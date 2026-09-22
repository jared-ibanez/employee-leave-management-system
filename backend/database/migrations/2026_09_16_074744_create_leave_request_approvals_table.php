<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_request_approvals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('leave_request_id')
                ->constrained('leave_requests')
                ->cascadeOnDelete();

            $table->foreignId('approver_id')
                ->constrained('employees')
                ->restrictOnDelete();

            $table->unsignedSmallInteger('approval_level');

            $table->string('status', 30)
                ->default('pending');

            $table->text('remarks')
                ->nullable();

            $table->timestamp('acted_at')
                ->nullable();

            $table->timestamps();

            $table->unique(
                ['leave_request_id', 'approval_level'],
                'leave_request_approval_level_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_request_approvals');
    }
};