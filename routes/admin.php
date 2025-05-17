<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('admins/all', function () {
          return Inertia::render('admins/admins');
        })->name('admin.all');
    Route::post('/admin/add', [UserController::class, 'addAdmin'])->name('admin.add');
    Route::delete('/admin/delete', [UserController::class, 'deleteAdmin'])->name('admin.delete');
    Route::get('/admin/admins', [UserController::class, 'getAdmins'])->name('admin.admins');
    Route::get('/admin/create', [UserController::class, 'createAdmin'])->name('admin.create');
    Route::put('/admin/changePassword', [UserController::class, 'changePasswordAdmin'])->name('admin.changePassword');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/pages.php';
require __DIR__ . '/settings.php';
