<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home/home');
})->name('home');


require __DIR__.'/auth.php';
require __DIR__.'/admin.php';

