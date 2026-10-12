<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeaveBalanceResource;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LeaveBalanceController extends Controller
{
    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $validated = $request->validate([
            'year' => [
                'nullable',
                'integer',
                'min:2000',
                'max:2100',
            ],
        ]);

        $year =
            $validated['year']
            ?? now()->year;

        $employee =
            $request->user()->employee;

        abort_unless(
            $employee,
            403,
            'No employee profile is associated with this account.'
        );

        $pendingByType =
            LeaveRequest::query()
                ->where(
                    'employee_id',
                    $employee->id
                )
                ->where(
                    'status',
                    LeaveRequest::STATUS_PENDING
                )
                ->whereYear(
                    'start_date',
                    $year
                )
                ->selectRaw(
                    'leave_type_id, SUM(total_days) as pending_days'
                )
                ->groupBy('leave_type_id')
                ->pluck(
                    'pending_days',
                    'leave_type_id'
                );

        $balances =
            $employee
                ->leaveBalances()
                ->with('leaveType')
                ->where('year', $year)
                ->orderBy('leave_type_id')
                ->get();

        foreach ($balances as $balance) {
            $balance->setAttribute(
                'pending_days',
                (float) (
                    $pendingByType[
                        $balance->leave_type_id
                    ]
                    ?? 0
                )
            );
        }

        return LeaveBalanceResource::collection(
            $balances
        );
    }
}