<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_number',

        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'contact_number',
        'birthdate',

        'department_id',
        'supervisor_id',
        'position',
        'date_hired',
        'employment_status',
    ];

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
            'date_hired' => 'date',
        ];
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(
            Employee::class,
            'supervisor_id'
        );
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(
            Employee::class,
            'supervisor_id'
        );
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(
            LeaveRequestApproval::class,
            'approver_id'
        );
    }
    public function getFullNameAttribute(): string
    {
        return collect([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
            $this->suffix,
        ])
            ->filter()
            ->implode(' ');
    }
}