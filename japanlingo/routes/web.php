<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//login register
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');



// Guest Routes
Route::get('/', fn() => Inertia::render('landingPage'))->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/pricing', fn() => Inertia::render('Pricing'))->name('pricing');
// Route::get('MainDashboard', fn() => Inertia::render('MainDashboard'))->name('MainDashboard');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('MainDashboard'))->name('dashboard');

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Admin/AdminDashboard'))->name('dashboard');
    });

    // User Routes
    Route::middleware('role:student')->prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('User/UserDashboard'))->name('dashboard');
    });
});

require __DIR__.'/auth.php';
