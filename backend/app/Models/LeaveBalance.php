<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'year',
        'entitlement_days',
        'carried_forward_days',
        'adjustment_days',
        'used_days',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'entitlement_days' => 'decimal:2',
            'carried_forward_days' => 'decimal:2',
            'adjustment_days' => 'decimal:2',
            'used_days' => 'decimal:2',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function getRemainingDaysAttribute(): float
    {
        return (float) $this->entitlement_days
            + (float) $this->carried_forward_days
            + (float) $this->adjustment_days
            - (float) $this->used_days;
    }
}