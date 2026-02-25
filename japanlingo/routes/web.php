<?php

use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\LearningController;
use App\Http\Controllers\User\ProgressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// login register
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');

// Guest Routes
Route::get('/', fn() => Inertia::render('landingPage'))->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/pricing', fn() => Inertia::render('Pricing'))->name('pricing');
Route::get('/roadmap', fn() => Inertia::render('Roadmap'))->name('roadmap');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('user.dashboard');
    })->name('dashboard');

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Admin/AdminDashboard'))->name('dashboard');
        
        Route::resource('levels', LevelController::class);
        Route::resource('modules', ModuleController::class);
        Route::resource('lessons', LessonController::class);
        Route::resource('quizzes', QuizController::class);
    });

    // User Routes
    Route::middleware('role:student')->prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
        
        Route::get('/lessons/{lesson}', [LearningController::class, 'showLesson'])->name('lessons.show');
        Route::get('/quizzes/{quiz}', [LearningController::class, 'showQuiz'])->name('quizzes.show');
        
        Route::post('/attempts', [ProgressController::class, 'storeAttempt'])->name('attempts.store');
        Route::post('/modules/complete', [ProgressController::class, 'completeModule'])->name('modules.complete');
    });
});

require __DIR__.'/auth.php';
