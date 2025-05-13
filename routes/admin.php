<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/create', [UserController::class, 'createAdmin']);
    Route::get('/admin/all', [UserController::class, 'getAdmins']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admins', function () {
        return Inertia::render('admins/admins');
    })->name('admin.admins');

});

require __DIR__.'/pages.php';
require __DIR__.'/settings.php';
