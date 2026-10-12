<?php

namespace App\Http\Resources;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'start_date' =>
                $this->start_date?->toDateString(),

            'end_date' =>
                $this->end_date?->toDateString(),

            'total_days' =>
                (float) $this->total_days,

            'reason' =>
                $this->reason,

            'status' =>
                $this->status,

            'submitted_at' =>
                $this->submitted_at?->toISOString(),

            'cancelled_at' =>
                $this->cancelled_at?->toISOString(),

            'cancellation_reason' =>
                $this->cancellation_reason,

            'can_cancel' =>
                $request->user()?->employee?->id
                    === $this->employee_id
                && $this->status
                    === LeaveRequest::STATUS_PENDING,

            'leave_type' =>
                new LeaveTypeResource(
                    $this->whenLoaded('leaveType')
                ),

            'employee' =>
                $this->whenLoaded(
                    'employee',
                    function () {
                        return [
                            'id' =>
                                $this->employee->id,

                            'employee_number' =>
                                $this->employee
                                    ->employee_number,

                            'full_name' =>
                                $this->employee
                                    ->full_name,

                            'department' =>
                                $this->employee
                                    ->department
                                    ?->name,
                        ];
                    }
                ),

            'approvals' =>
                $this->whenLoaded(
                    'approvals',
                    function () {
                        return $this
                            ->approvals
                            ->map(function ($approval) {
                                return [
                                    'id' =>
                                        $approval->id,

                                    'level' =>
                                        $approval
                                            ->approval_level,

                                    'status' =>
                                        $approval->status,

                                    'remarks' =>
                                        $approval->remarks,

                                    'acted_at' =>
                                        $approval
                                            ->acted_at
                                            ?->toISOString(),

                                    'approver' =>
                                        $approval
                                            ->approver
                                            ?->full_name,
                                ];
                            });
                    }
                ),
        ];
    }
}