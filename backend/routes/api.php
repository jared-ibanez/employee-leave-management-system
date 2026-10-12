<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveBalanceController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\LeaveTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SupervisorApprovalController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [
    AuthController::class,
    'login',
])->middleware('throttle:5,1');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'active.user',
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [
        AuthController::class,
        'me',
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Leave Reference Data
    |--------------------------------------------------------------------------
    */

    Route::get('/leave-types', [
        LeaveTypeController::class,
        'index',
    ]);

    Route::get('/leave-balances', [
        LeaveBalanceController::class,
        'index',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Leave Requests
    |--------------------------------------------------------------------------
    */

    Route::get('/leave-requests', [
        LeaveRequestController::class,
        'index',
    ]);

    Route::post('/leave-requests', [
        LeaveRequestController::class,
        'store',
    ]);

    Route::get('/leave-requests/{leaveRequest}', [
        LeaveRequestController::class,
        'show',
    ]);

    Route::post(
        '/leave-requests/{leaveRequest}/cancel',
        [
            LeaveRequestController::class,
            'cancel',
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Supervisor
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'role:supervisor'
    )
        ->prefix('supervisor')
        ->group(function () {

            Route::get(
                '/approvals',
                [
                    SupervisorApprovalController::class,
                    'index',
                ]
            );

            Route::get(
                '/approvals/{approval}',
                [
                    SupervisorApprovalController::class,
                    'show',
                ]
            );

            Route::post(
                '/approvals/{approval}/approve',
                [
                    SupervisorApprovalController::class,
                    'approve',
                ]
            );

            Route::post(
                '/approvals/{approval}/reject',
                [
                    SupervisorApprovalController::class,
                    'reject',
                ]
            );
        });
});