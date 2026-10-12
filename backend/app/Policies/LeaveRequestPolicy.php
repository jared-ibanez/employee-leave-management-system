<?php

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    public function view(
        User $user,
        LeaveRequest $leaveRequest
    ): bool {
        return $user->employee !== null
            && $leaveRequest->employee_id
                === $user->employee->id;
    }

    public function cancel(
        User $user,
        LeaveRequest $leaveRequest
    ): bool {
        return $user->employee !== null
            && $leaveRequest->employee_id
                === $user->employee->id
            && $leaveRequest->status
                === LeaveRequest::STATUS_PENDING;
    }
}