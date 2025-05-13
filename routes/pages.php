<?php

use App\Http\Controllers\PagesController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('pages', 'pages/home');

    Route::patch('pages/home', [PagesController::class, 'home'])->name('pages.home');
    Route::patch('pages/about', [PagesController::class, 'about'])->name('pages.about');
    Route::patch('pages/contact', [PagesController::class, 'contact'])->name('pages.contact');
    // Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    // Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    // Route::get('settings/appearance', function () {
    //     return Inertia::render('settings/appearance');
    // })->name('appearance');
});
