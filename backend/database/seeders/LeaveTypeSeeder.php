<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'code' => 'VL',
                'name' => 'Vacation Leave',
                'description' => 'Leave used for vacation and personal time.',
                'default_days' => 15,
                'requires_attachment' => false,
                'is_active' => true,
            ],
            [
                'code' => 'SL',
                'name' => 'Sick Leave',
                'description' => 'Leave used when an employee is ill.',
                'default_days' => 15,
                'requires_attachment' => false,
                'is_active' => true,
            ],
            [
                'code' => 'EL',
                'name' => 'Emergency Leave',
                'description' => 'Leave used for urgent personal or family emergencies.',
                'default_days' => 5,
                'requires_attachment' => false,
                'is_active' => true,
            ],
            [
                'code' => 'BL',
                'name' => 'Bereavement Leave',
                'description' => 'Leave following the death of an immediate family member.',
                'default_days' => 3,
                'requires_attachment' => false,
                'is_active' => true,
            ],
        ];

        foreach ($leaveTypes as $leaveType) {
            LeaveType::updateOrCreate(
                ['code' => $leaveType['code']],
                $leaveType
            );
        }
    }
}