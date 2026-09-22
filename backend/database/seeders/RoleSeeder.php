<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'employee',
                'display_name' => 'Employee',
            ],
            [
                'name' => 'supervisor',
                'display_name' => 'Supervisor',
            ],
            [
                'name' => 'hr_admin',
                'display_name' => 'HR / Administrator',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }
    }
}