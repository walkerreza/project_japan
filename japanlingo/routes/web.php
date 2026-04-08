<?php

use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\LearningController;
use App\Http\Controllers\User\ProgressController;
use App\Http\Controllers\User\CertificateController;
use App\Http\Controllers\ProfileController;
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
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'superadmin') {
            return redirect()->route('superadmin.dashboard');
        } elseif ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('user.dashboard');
    })->name('dashboard');

    // Superadmin Routes
    Route::middleware('role:superadmin')->prefix('superadmin')->name('superadmin.')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('SuperAdmin/SuperAdminDashboard'))->name('dashboard');
        Route::get('/users', fn() => Inertia::render('SuperAdmin/Users'))->name('users');
        Route::get('/admins', fn() => Inertia::render('SuperAdmin/Admins'))->name('admins');
        Route::get('/content', fn() => Inertia::render('SuperAdmin/Content'))->name('content');
        Route::get('/gamification', fn() => Inertia::render('SuperAdmin/Gamification'))->name('gamification');
        Route::get('/pricing', fn() => Inertia::render('SuperAdmin/Pricing'))->name('pricing');
        Route::get('/system', fn() => Inertia::render('SuperAdmin/System'))->name('system');
    });

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/users', fn() => Inertia::render('Admin/Users/Index'))->name('users');
        Route::get('/gamification', fn() => Inertia::render('Admin/Gamification/Index'))->name('gamification');
        Route::get('/quiz-builder', fn() => Inertia::render('Admin/Builders/QuizBuilder'))->name('quiz.builder');

        // Level CRUD
        Route::apiResource('/levels', LevelController::class)->only(['index', 'store', 'update', 'destroy']);

        // Upload Endpoint
        Route::post('/upload', [\App\Http\Controllers\Admin\UploadController::class, 'store'])->name('upload');

        // Quizzes CRUD (home/index untuk daftar kuis)
        Route::get('/quizzes', [QuizController::class, 'index'])->name('quizzes.index');
        Route::post('/quizzes', [QuizController::class, 'store'])->name('quizzes.store');
        Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy'])->name('quizzes.destroy');

        // Module CRUD
        Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
        Route::post('/modules', [ModuleController::class, 'store'])->name('modules.store');
        Route::get('/modules/{module}/builder', [ModuleController::class, 'builder'])->name('modules.builder');
        Route::post('/modules/{module}/builder', [ModuleController::class, 'updateContent'])->name('modules.builder.update');
        Route::put('/modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');

        // Lesson CRUD
        Route::get('/lessons', [LessonController::class, 'index'])->name('lessons.index');
        Route::get('/lessons/create', [LessonController::class, 'create'])->name('lessons.create');
        Route::post('/lessons', [LessonController::class, 'store'])->name('lessons.store');
        Route::get('/lessons/{lesson}/edit', [LessonController::class, 'edit'])->name('lessons.edit');
        Route::put('/lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');
        Route::post('/lessons/reorder', [LessonController::class, 'reorder'])->name('lessons.reorder');

        // Question CRUD
        Route::get('/questions', [QuestionController::class, 'index'])->name('questions.index');
        Route::get('/questions/create', [QuestionController::class, 'create'])->name('questions.create');
        Route::post('/questions', [QuestionController::class, 'store'])->name('questions.store');
        Route::get('/questions/{question}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
        Route::put('/questions/{question}', [QuestionController::class, 'update'])->name('questions.update');
        Route::delete('/questions/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy');
        Route::post('/questions/reorder', [QuestionController::class, 'reorder'])->name('questions.reorder');
    });

    // User Routes
    Route::middleware('role:user')->prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', fn() => Inertia::render('User/Profile'))->name('profile');
        
        Route::get('/lessons', fn() => Inertia::render('User/LessonLobby'))->name('lessons.index');
        Route::get('/lessons/{lesson}', [LearningController::class, 'showLesson'])->name('lessons.show');
        
        Route::get('/quizzes', fn() => Inertia::render('User/QuizLobby'))->name('quizzes.index');
        Route::get('/quizzes/{quiz}', [LearningController::class, 'showQuiz'])->name('quizzes.show');
        
        Route::get('/leaderboard', fn() => Inertia::render('User/Leaderboard'))->name('leaderboard');
        Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates');
        Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');
        Route::get('/progress', fn() => Inertia::render('User/Progress'))->name('progress');
        
        Route::post('/attempts', [ProgressController::class, 'storeAttempt'])->name('attempts.store');
        Route::post('/lessons/complete', [ProgressController::class, 'completeLesson'])->name('lessons.complete');
    });
});

require __DIR__.'/auth.php';
