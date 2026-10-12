<?php

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\LeaveRequestApproval;
use App\Models\User;

class LeaveRequestApprovalPolicy
{
    public function view(
        User $user,
        LeaveRequestApproval $approval
    ): bool {
        return $user->employee !== null
            && $approval->approver_id
                === $user->employee->id;
    }


    public function approve(
        User $user,
        LeaveRequestApproval $approval
    ): bool {
        return $this->view(
                $user,
                $approval
            )
            && $approval->approval_level
                === LeaveRequestApproval::LEVEL_SUPERVISOR
            && $approval->status
                === LeaveRequestApproval::STATUS_PENDING
            && $approval->leaveRequest?->status
                === LeaveRequest::STATUS_PENDING;
    }


    public function reject(
        User $user,
        LeaveRequestApproval $approval
    ): bool {
        return $this->approve(
            $user,
            $approval
        );
    }
}