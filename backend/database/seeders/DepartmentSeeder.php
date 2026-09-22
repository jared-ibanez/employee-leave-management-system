<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'code' => 'ICT',
                'name' => 'Information and Communication Technology',
                'description' => 'Information technology and software services.',
                'is_active' => true,
            ],
            [
                'code' => 'HR',
                'name' => 'Human Resources',
                'description' => 'Human resource management and employee services.',
                'is_active' => true,
            ],
            [
                'code' => 'FIN',
                'name' => 'Finance',
                'description' => 'Financial operations and administration.',
                'is_active' => true,
            ],
            [
                'code' => 'ACC',
                'name' => 'Accounting',
                'description' => 'Accounting and financial records.',
                'is_active' => true,
            ],
            [
                'code' => 'REG',
                'name' => 'Registrar',
                'description' => 'Records and registration services.',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['code' => $department['code']],
                $department
            );
        }
    }
}