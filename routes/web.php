<?php

use App\Http\Controllers\WebsiteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WebsiteController::class, 'home'])->name('home');

Route::get('/about', [WebsiteController::class, 'about'])->name('website.about');

Route::get('/content/{ref}', [WebsiteController::class, 'show']);

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
