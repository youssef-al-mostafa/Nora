<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/create', [UserController::class, 'createAdmin']);
    Route::get('/admin/all', [UserController::class, 'getAdmins']);
});
