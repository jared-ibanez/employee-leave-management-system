<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

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
    | Employee Test
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:employee')
        ->get('/employee-test', function () {
            return response()->json([
                'message' => 'Employee access granted.',
            ]);
        });


    /*
    |--------------------------------------------------------------------------
    | HR Admin Test
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:hr_admin')
        ->get('/admin-test', function () {
            return response()->json([
                'message' => 'Administrator access granted.',
            ]);
        });
});