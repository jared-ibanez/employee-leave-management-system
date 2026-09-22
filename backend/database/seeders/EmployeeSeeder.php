<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Get Roles
        |--------------------------------------------------------------------------
        */

        $employeeRole = Role::where('name', 'employee')->firstOrFail();

        $supervisorRole = Role::where('name', 'supervisor')->firstOrFail();

        $adminRole = Role::where('name', 'hr_admin')->firstOrFail();


        /*
        |--------------------------------------------------------------------------
        | Get Departments
        |--------------------------------------------------------------------------
        */

        $ictDepartment = Department::where('code', 'ICT')->firstOrFail();

        $hrDepartment = Department::where('code', 'HR')->firstOrFail();


        /*
        |--------------------------------------------------------------------------
        | HR Administrator
        |--------------------------------------------------------------------------
        */

        $adminUser = User::updateOrCreate(
            [
                'email' => 'admin@leave.test',
            ],
            [
                'role_id' => $adminRole->id,
                'password' => Hash::make('Password123!'),
                'is_active' => true,
            ]
        );

        Employee::updateOrCreate(
            [
                'employee_number' => 'EMP-0001',
            ],
            [
                'user_id' => $adminUser->id,

                'first_name' => 'Helen',
                'middle_name' => null,
                'last_name' => 'Administrator',
                'suffix' => null,

                'contact_number' => '09181234560',
                'birthdate' => '1985-03-15',

                'department_id' => $hrDepartment->id,
                'supervisor_id' => null,

                'position' => 'HR Administrator',
                'date_hired' => '2020-01-15',
                'employment_status' => 'active',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | ICT Supervisor
        |--------------------------------------------------------------------------
        */

        $supervisorUser = User::updateOrCreate(
            [
                'email' => 'supervisor@leave.test',
            ],
            [
                'role_id' => $supervisorRole->id,
                'password' => Hash::make('Password123!'),
                'is_active' => true,
            ]
        );

        $supervisor = Employee::updateOrCreate(
            [
                'employee_number' => 'EMP-0002',
            ],
            [
                'user_id' => $supervisorUser->id,

                'first_name' => 'Maria',
                'middle_name' => null,
                'last_name' => 'Santos',
                'suffix' => null,

                'contact_number' => '09181234567',
                'birthdate' => '1988-05-20',

                'department_id' => $ictDepartment->id,
                'supervisor_id' => null,

                'position' => 'Software Development Supervisor',
                'date_hired' => '2019-06-10',
                'employment_status' => 'active',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Employee 1
        |--------------------------------------------------------------------------
        */

        $employeeUser1 = User::updateOrCreate(
            [
                'email' => 'employee1@leave.test',
            ],
            [
                'role_id' => $employeeRole->id,
                'password' => Hash::make('Password123!'),
                'is_active' => true,
            ]
        );

        Employee::updateOrCreate(
            [
                'employee_number' => 'EMP-0003',
            ],
            [
                'user_id' => $employeeUser1->id,

                'first_name' => 'Juan',
                'middle_name' => null,
                'last_name' => 'Dela Cruz',
                'suffix' => null,

                'contact_number' => '09171234567',
                'birthdate' => '1995-08-14',

                'department_id' => $ictDepartment->id,
                'supervisor_id' => $supervisor->id,

                'position' => 'Software Developer',
                'date_hired' => '2022-03-01',
                'employment_status' => 'active',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Employee 2
        |--------------------------------------------------------------------------
        */

        $employeeUser2 = User::updateOrCreate(
            [
                'email' => 'employee2@leave.test',
            ],
            [
                'role_id' => $employeeRole->id,
                'password' => Hash::make('Password123!'),
                'is_active' => true,
            ]
        );

        Employee::updateOrCreate(
            [
                'employee_number' => 'EMP-0004',
            ],
            [
                'user_id' => $employeeUser2->id,

                'first_name' => 'Anna',
                'middle_name' => null,
                'last_name' => 'Reyes',
                'suffix' => null,

                'contact_number' => '09171234568',
                'birthdate' => '1990-12-05',

                'department_id' => $ictDepartment->id,
                'supervisor_id' => $supervisor->id,

                'position' => 'Systems Analyst',
                'date_hired' => '2023-08-14',
                'employment_status' => 'active',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Employee 3
        |--------------------------------------------------------------------------
        */

        $employeeUser3 = User::updateOrCreate(
            [
                'email' => 'employee3@leave.test',
            ],
            [
                'role_id' => $employeeRole->id,
                'password' => Hash::make('Password123!'),
                'is_active' => true,
            ]
        );

        Employee::updateOrCreate(
            [
                'employee_number' => 'EMP-0005',
            ],
            [
                'user_id' => $employeeUser3->id,

                'first_name' => 'Carlo',
                'middle_name' => null,
                'last_name' => 'Mendoza',
                'suffix' => null,

                'contact_number' => '09171234569',
                'birthdate' => '1993-07-22',

                'department_id' => $ictDepartment->id,
                'supervisor_id' => $supervisor->id,

                'position' => 'Technical Support Specialist',
                'date_hired' => '2024-02-05',
                'employment_status' => 'active',
            ]
        );
    }
}