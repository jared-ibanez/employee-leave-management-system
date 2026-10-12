<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveRequestApproval;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LeaveRequestService
{
    public function create(
        
        Employee $employee,
        array $data,
        
        
    ): LeaveRequest {
        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);

        /*
        |--------------------------------------------------------------------------
        | Leave requests cannot currently cross calendar years
        |--------------------------------------------------------------------------
        */

        $supervisor = $employee
            ->supervisor()
            ->with([
                'user.role',
            ])
            ->first();

        if (
            ! $supervisor
            || ! $supervisor->user
            || ! $supervisor->user->is_active
            || ! $supervisor->user->hasRole('supervisor')
        ) {
            throw ValidationException::withMessages([
                'leave_type_id' => [
                    'No active supervisor is assigned to your employee profile. Please contact HR.',
                ],
            ]);
        }

        if ($start->year !== $end->year) {
            throw ValidationException::withMessages([
                'end_date' => [
                    'A leave request cannot currently span multiple calendar years.',
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Calculate working days
        |--------------------------------------------------------------------------
        */

        $totalDays = $this->calculateWorkingDays(
            $start,
            $end
        );

        if ($totalDays <= 0) {
            throw ValidationException::withMessages([
                'start_date' => [
                    'The selected date range does not contain any working days.',
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent overlapping leave
        |--------------------------------------------------------------------------
        */

        $hasOverlap = LeaveRequest::query()
            ->where(
                'employee_id',
                $employee->id
            )
            ->whereIn('status', [
                LeaveRequest::STATUS_PENDING,
                LeaveRequest::STATUS_APPROVED,
            ])
            ->where(function ($query) use (
                $start,
                $end
            ) {
                $query
                    ->whereDate(
                        'start_date',
                        '<=',
                        $end->toDateString()
                    )
                    ->whereDate(
                        'end_date',
                        '>=',
                        $start->toDateString()
                    );
            })
            ->exists();

        if ($hasOverlap) {
            throw ValidationException::withMessages([
                'start_date' => [
                    'You already have a pending or approved leave request that overlaps these dates.',
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Find employee balance
        |--------------------------------------------------------------------------
        */

        $balance = LeaveBalance::query()
            ->where(
                'employee_id',
                $employee->id
            )
            ->where(
                'leave_type_id',
                $data['leave_type_id']
            )
            ->where(
                'year',
                $start->year
            )
            ->first();

        if (! $balance) {
            throw ValidationException::withMessages([
                'leave_type_id' => [
                    'No leave balance is available for the selected leave type.',
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Reserve pending leave days
        |--------------------------------------------------------------------------
        |
        | used_days only represents finalized approved leave.
        |
        | We also consider pending leave requests so the employee cannot submit
        | multiple requests that collectively exceed their available balance.
        |
        */

        $pendingDays = LeaveRequest::query()
            ->where(
                'employee_id',
                $employee->id
            )
            ->where(
                'leave_type_id',
                $data['leave_type_id']
            )
            ->where(
                'status',
                LeaveRequest::STATUS_PENDING
            )
            ->whereYear(
                'start_date',
                $start->year
            )
            ->sum('total_days');

        $availableDays =
            (float) $balance->remaining_days
            - (float) $pendingDays;

        if ($totalDays > $availableDays) {
            throw ValidationException::withMessages([
                'leave_type_id' => [
                    sprintf(
                        'You only have %.2f available leave days remaining.',
                        max($availableDays, 0)
                    ),
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Create request
        |--------------------------------------------------------------------------
        */

        return DB::transaction(
            function () use (
                $employee,
                $data,
                $totalDays,
                $supervisor
            ) {
                $leaveRequest =
                    LeaveRequest::create([
                        'employee_id' =>
                            $employee->id,

                        'leave_type_id' =>
                            $data['leave_type_id'],

                        'start_date' =>
                            $data['start_date'],

                        'end_date' =>
                            $data['end_date'],

                        'total_days' =>
                            $totalDays,

                        'reason' =>
                            $data['reason'],

                        'status' =>
                            LeaveRequest::STATUS_PENDING,

                        'submitted_at' =>
                            now(),
                    ]);

                /*
                |--------------------------------------------------------------------------
                | Initial supervisor approval
                |--------------------------------------------------------------------------
                */

                if ($employee->supervisor_id) {
                    LeaveRequestApproval::create([
                        'leave_request_id' =>
                            $leaveRequest->id,

                        'approver_id' =>
                            $supervisor->id,

                        'approval_level' =>
                            LeaveRequestApproval::LEVEL_SUPERVISOR,

                        'status' =>
                            LeaveRequestApproval::STATUS_PENDING,
                    ]);
                }

                return $leaveRequest->load([
                    'leaveType',
                    'employee.department',
                    'approvals.approver',
                ]);
            }
        );
    }


    private function calculateWorkingDays(
        Carbon $start,
        Carbon $end
    ): float {
        $days = 0;

        $current = $start->copy()->startOfDay();
        $last = $end->copy()->startOfDay();

        while ($current->lte($last)) {
            if ($current->isWeekday()) {
                $days++;
            }

            $current->addDay();
        }

        return (float) $days;
    }
}