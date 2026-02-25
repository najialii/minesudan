<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkerController;
use App\Http\Controllers\Api\MachineController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Products and Sales (All authenticated users)
    Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);
    Route::post('/sales', [\App\Http\Controllers\Api\SaleController::class, 'store']);
    Route::get('/sales', [\App\Http\Controllers\Api\SaleController::class, 'index']);

    // Admin only routes
    Route::middleware('can:admin')->group(function () {
        Route::apiResource('companies', CompanyController::class);
    });

    // Company Manager and Admin routes
    Route::middleware('can:company-manager')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('workers', WorkerController::class);
        Route::apiResource('machines', MachineController::class);
        Route::get('/machine-categories', [\App\Http\Controllers\Api\MachineCategoryController::class, 'index']);
        Route::post('/machine-categories', [\App\Http\Controllers\Api\MachineCategoryController::class, 'store']);
        Route::put('/machine-categories/{machineCategory}', [\App\Http\Controllers\Api\MachineCategoryController::class, 'update']);
        Route::delete('/machine-categories/{machineCategory}', [\App\Http\Controllers\Api\MachineCategoryController::class, 'destroy']);
        Route::post('/products', [\App\Http\Controllers\Api\ProductController::class, 'store']);
        Route::put('/products/{product}', [\App\Http\Controllers\Api\ProductController::class, 'update']);
    });
});
