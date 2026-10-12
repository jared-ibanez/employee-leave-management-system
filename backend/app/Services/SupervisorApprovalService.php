<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveRequestApproval;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupervisorApprovalService
{
    /*
    |--------------------------------------------------------------------------
    | Approve
    |--------------------------------------------------------------------------
    */

    public function approve(
        LeaveRequestApproval $approval,
        ?string $remarks = null
    ): LeaveRequestApproval {
        return DB::transaction(
            function () use (
                $approval,
                $remarks
            ) {
                /*
                |--------------------------------------------------------------------------
                | Lock Approval
                |--------------------------------------------------------------------------
                */

                $lockedApproval =
                    LeaveRequestApproval::query()
                        ->lockForUpdate()
                        ->findOrFail(
                            $approval->id
                        );


                /*
                |--------------------------------------------------------------------------
                | Lock Leave Request
                |--------------------------------------------------------------------------
                */

                $leaveRequest =
                    LeaveRequest::query()
                        ->lockForUpdate()
                        ->findOrFail(
                            $lockedApproval
                                ->leave_request_id
                        );


                $this->ensurePendingSupervisorApproval(
                    $lockedApproval,
                    $leaveRequest
                );


                /*
                |--------------------------------------------------------------------------
                | Find HR Approver
                |--------------------------------------------------------------------------
                */

                $hrApprover =
                    $this->findHrApprover();

                if (! $hrApprover) {
                    throw ValidationException::withMessages([
                        'approval' => [
                            'No active HR administrator is currently available for final approval.',
                        ],
                    ]);
                }


                /*
                |--------------------------------------------------------------------------
                | Approve Supervisor Step
                |--------------------------------------------------------------------------
                */

                $lockedApproval->update([
                    'status' =>
                        LeaveRequestApproval::STATUS_APPROVED,

                    'remarks' =>
                        $remarks,

                    'acted_at' =>
                        now(),
                ]);


                /*
                |--------------------------------------------------------------------------
                | Create HR Approval Step
                |--------------------------------------------------------------------------
                */

                LeaveRequestApproval::firstOrCreate(
                    [
                        'leave_request_id' =>
                            $leaveRequest->id,

                        'approval_level' =>
                            LeaveRequestApproval::LEVEL_HR,
                    ],
                    [
                        'approver_id' =>
                            $hrApprover->id,

                        'status' =>
                            LeaveRequestApproval::STATUS_PENDING,
                    ]
                );


                /*
                |--------------------------------------------------------------------------
                | Important:
                |
                | Leave request remains PENDING here.
                | HR will make the final decision in Phase 8.
                |--------------------------------------------------------------------------
                */


                return LeaveRequestApproval::query()
                    ->with([
                        'approver',
                        'leaveRequest.leaveType',
                        'leaveRequest.employee.department',
                        'leaveRequest.approvals.approver',
                    ])
                    ->findOrFail(
                        $lockedApproval->id
                    );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Reject
    |--------------------------------------------------------------------------
    */

    public function reject(
        LeaveRequestApproval $approval,
        string $remarks
    ): LeaveRequestApproval {
        return DB::transaction(
            function () use (
                $approval,
                $remarks
            ) {
                $lockedApproval =
                    LeaveRequestApproval::query()
                        ->lockForUpdate()
                        ->findOrFail(
                            $approval->id
                        );


                $leaveRequest =
                    LeaveRequest::query()
                        ->lockForUpdate()
                        ->findOrFail(
                            $lockedApproval
                                ->leave_request_id
                        );


                $this->ensurePendingSupervisorApproval(
                    $lockedApproval,
                    $leaveRequest
                );


                /*
                |--------------------------------------------------------------------------
                | Reject Supervisor Step
                |--------------------------------------------------------------------------
                */

                $lockedApproval->update([
                    'status' =>
                        LeaveRequestApproval::STATUS_REJECTED,

                    'remarks' =>
                        $remarks,

                    'acted_at' =>
                        now(),
                ]);


                /*
                |--------------------------------------------------------------------------
                | Reject Whole Request
                |--------------------------------------------------------------------------
                */

                $leaveRequest->update([
                    'status' =>
                        LeaveRequest::STATUS_REJECTED,
                ]);


                /*
                |--------------------------------------------------------------------------
                | Cancel Any Remaining Pending Approval Steps
                |--------------------------------------------------------------------------
                */

                LeaveRequestApproval::query()
                    ->where(
                        'leave_request_id',
                        $leaveRequest->id
                    )
                    ->where(
                        'id',
                        '<>',
                        $lockedApproval->id
                    )
                    ->where(
                        'status',
                        LeaveRequestApproval::STATUS_PENDING
                    )
                    ->update([
                        'status' =>
                            LeaveRequestApproval::STATUS_CANCELLED,

                        'acted_at' =>
                            now(),
                    ]);


                return LeaveRequestApproval::query()
                    ->with([
                        'approver',
                        'leaveRequest.leaveType',
                        'leaveRequest.employee.department',
                        'leaveRequest.approvals.approver',
                    ])
                    ->findOrFail(
                        $lockedApproval->id
                    );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Current Approval State
    |--------------------------------------------------------------------------
    */

    private function ensurePendingSupervisorApproval(
        LeaveRequestApproval $approval,
        LeaveRequest $leaveRequest
    ): void {
        if (
            $approval->approval_level
            !== LeaveRequestApproval::LEVEL_SUPERVISOR
        ) {
            throw ValidationException::withMessages([
                'approval' => [
                    'This is not a supervisor approval step.',
                ],
            ]);
        }


        if (
            $approval->status
            !== LeaveRequestApproval::STATUS_PENDING
        ) {
            throw ValidationException::withMessages([
                'approval' => [
                    'This approval has already been processed.',
                ],
            ]);
        }


        if (
            $leaveRequest->status
            !== LeaveRequest::STATUS_PENDING
        ) {
            throw ValidationException::withMessages([
                'approval' => [
                    'This leave request is no longer pending.',
                ],
            ]);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Find HR Administrator
    |--------------------------------------------------------------------------
    */

    private function findHrApprover(): ?Employee
    {
        return Employee::query()
            ->whereHas(
                'user',
                function ($userQuery) {
                    $userQuery
                        ->where(
                            'is_active',
                            true
                        )
                        ->whereHas(
                            'role',
                            function (
                                $roleQuery
                            ) {
                                $roleQuery
                                    ->where(
                                        'name',
                                        'hr_admin'
                                    );
                            }
                        );
                }
            )
            ->orderBy('id')
            ->first();
    }
}