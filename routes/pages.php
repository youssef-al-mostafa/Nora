<?php

use App\Http\Controllers\PagesController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('pages', 'pages/home');

    Route::get('pages/home', [PagesController::class, 'home'])->name('pages.home');
    Route::get('pages/about', [PagesController::class, 'about'])->name('pages.about');
    Route::get('pages/contact', [PagesController::class, 'contact'])->name('pages.contact');

    Route::patch('content/update', [PagesController::class, 'update'])->name('update.content');
});
