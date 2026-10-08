<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoginActivity;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => [
                'required',
                'email',
            ],

            'password' => [
                'required',
                'string',
            ],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => [
                    'The provided credentials are incorrect.',
                ],
            ]);
        }

        $request->session()->regenerate();

        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Check Account Status
        |--------------------------------------------------------------------------
        */

        if (! $user->is_active) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => [
                    'This account is currently inactive.',
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Update Last Login
        |--------------------------------------------------------------------------
        */

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create Login Audit Record
        |--------------------------------------------------------------------------
        */

        LoginActivity::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'logged_in_at' => now(),
        ]);

        return response()->json([
            'message' => 'Login successful.',
            'user' => $this->userData($user),
        ]);
    }


    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->userData(
                $request->user()
            ),
        ]);
    }


    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }


    private function userData(User $user): array
    {
        $user->load([
            'role',
            'employee.department',
            'employee.supervisor',
        ]);

        $employee = $user->employee;

        return [
            'id' => $user->id,

            'email' => $user->email,

            'is_active' => $user->is_active,

            'last_login_at' => $user->last_login_at,

            /*
            |--------------------------------------------------------------------------
            | Role
            |--------------------------------------------------------------------------
            */

            'role' => $user->role ? [
                'id' => $user->role->id,

                'name' => $user->role->name,

                'display_name' =>
                    $user->role->display_name,
            ] : null,

            /*
            |--------------------------------------------------------------------------
            | Employee
            |--------------------------------------------------------------------------
            */

            'employee' => $employee ? [

                'id' => $employee->id,

                'employee_number' =>
                    $employee->employee_number,

                'first_name' =>
                    $employee->first_name,

                'middle_name' =>
                    $employee->middle_name,

                'last_name' =>
                    $employee->last_name,

                'suffix' =>
                    $employee->suffix,

                'full_name' =>
                    $employee->full_name,

                'contact_number' =>
                    $employee->contact_number,

                'birthdate' =>
                    $employee->birthdate,

                'position' =>
                    $employee->position,

                'date_hired' =>
                    $employee->date_hired,

                'employment_status' =>
                    $employee->employment_status,

                /*
                |--------------------------------------------------------------------------
                | Department
                |--------------------------------------------------------------------------
                */

                'department' =>
                    $employee->department ? [

                        'id' =>
                            $employee->department->id,

                        'code' =>
                            $employee->department->code,

                        'name' =>
                            $employee->department->name,

                    ] : null,

                /*
                |--------------------------------------------------------------------------
                | Supervisor
                |--------------------------------------------------------------------------
                */

                'supervisor' =>
                    $employee->supervisor ? [

                        'id' =>
                            $employee->supervisor->id,

                        'employee_number' =>
                            $employee
                                ->supervisor
                                ->employee_number,

                        'full_name' =>
                            $employee
                                ->supervisor
                                ->full_name,

                    ] : null,

            ] : null,
        ];
    }
}