<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveBalanceSeeder extends Seeder
{
    public function run(): void
    {
        $year = now()->year;

        $employees = Employee::all();
        $leaveTypes = LeaveType::where('is_active', true)->get();

        foreach ($employees as $employee) {
            foreach ($leaveTypes as $leaveType) {
                LeaveBalance::updateOrCreate(
                    [
                        'employee_id' => $employee->id,
                        'leave_type_id' => $leaveType->id,
                        'year' => $year,
                    ],
                    [
                        'entitlement_days' => $leaveType->default_days,
                        'carried_forward_days' => 0,
                        'adjustment_days' => 0,
                        'used_days' => 0,
                    ]
                );
            }
        }
    }
}