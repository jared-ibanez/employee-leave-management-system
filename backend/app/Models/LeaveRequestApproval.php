<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequestApproval extends Model
{
    use HasFactory;

    /*
    |--------------------------------------------------------------------------
    | Approval Levels
    |--------------------------------------------------------------------------
    */

    public const LEVEL_SUPERVISOR = 1;
    public const LEVEL_HR = 2;

    /*
    |--------------------------------------------------------------------------
    | Statuses
    |--------------------------------------------------------------------------
    */

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';


    protected $fillable = [
        'leave_request_id',
        'approver_id',
        'approval_level',
        'status',
        'remarks',
        'acted_at',
    ];


    protected function casts(): array
    {
        return [
            'approval_level' => 'integer',
            'acted_at' => 'datetime',
        ];
    }


    public function leaveRequest(): BelongsTo
    {
        return $this->belongsTo(
            LeaveRequest::class
        );
    }


    public function approver(): BelongsTo
    {
        return $this->belongsTo(
            Employee::class,
            'approver_id'
        );
    }
}