<?php

use App\Http\Controllers\Admin\AdminAchievementController;
use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminLessonController;
use App\Http\Controllers\Admin\AdminLevelController;
use App\Http\Controllers\Admin\AdminModuleController;
use App\Http\Controllers\Admin\AdminKanjiController;
use App\Http\Controllers\Admin\AdminQuestionController;
use App\Http\Controllers\Admin\AdminQuizController;
use App\Http\Controllers\Admin\AdminUploadController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\LearningController;
use App\Http\Controllers\User\NewsController;
use App\Http\Controllers\User\ProgressController;
use App\Http\Controllers\User\CertificateController;
use App\Http\Controllers\SuperAdmin\SuperAdminActivityController;
use App\Http\Controllers\SuperAdmin\SuperAdminAdminController;
use App\Http\Controllers\SuperAdmin\SuperAdminContentController;
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\SuperAdminGamificationController;
use App\Http\Controllers\SuperAdmin\SuperAdminPaymentController;
use App\Http\Controllers\SuperAdmin\SuperAdminSystemController;
use App\Http\Controllers\SuperAdmin\SuperAdminUserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest Routes
Route::get('/', fn() => Inertia::render('landingPage'))->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/pricing', fn() => Inertia::render('Pricing'))->name('pricing');
Route::get('/roadmap', fn() => Inertia::render('Roadmap'))->name('roadmap');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Profile
    Route::get('/profile', fn() => Inertia::render('User/Profile'))->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');

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
        Route::get('/dashboard', SuperAdminDashboardController::class)->name('dashboard');
        Route::get('/users', SuperAdminUserController::class)->name('users');
        Route::patch('/users/{user}/status', [SuperAdminUserController::class, 'updateStatus'])->name('users.status');
        Route::post('/users/{user}/reset-password', [SuperAdminUserController::class, 'resetPassword'])->name('users.reset-password');
        Route::get('/admins', SuperAdminAdminController::class)->name('admins');
        Route::post('/admins', [SuperAdminAdminController::class, 'store'])->name('admins.store');
        Route::patch('/admins/{user}/status', [SuperAdminAdminController::class, 'updateStatus'])->name('admins.status');
        Route::post('/admins/{user}/reset-password', [SuperAdminAdminController::class, 'resetPassword'])->name('admins.reset-password');
        Route::get('/content', SuperAdminContentController::class)->name('content');
        Route::post('/content/news', [SuperAdminContentController::class, 'store'])->name('content.news.store');
        Route::put('/content/news/{news}', [SuperAdminContentController::class, 'update'])->name('content.news.update');
        Route::delete('/content/news/{news}', [SuperAdminContentController::class, 'destroy'])->name('content.news.destroy');
        Route::post('/content/news/editor-images', [SuperAdminContentController::class, 'storeEditorImage'])->name('content.news.editor-images.store');
        Route::post('/content/news/{news}/attachments', [SuperAdminContentController::class, 'storeAttachment'])->name('content.news.attachments.store');
        Route::delete('/content/news/{news}/attachments/{attachment}', [SuperAdminContentController::class, 'destroyAttachment'])->name('content.news.attachments.destroy');
        Route::get('/gamification', SuperAdminGamificationController::class)->name('gamification');
        Route::get('/activity', SuperAdminActivityController::class)->name('activity');
        Route::get('/payments', SuperAdminPaymentController::class)->name('payments');
        Route::post('/payments/plans', [SuperAdminPaymentController::class, 'storePlan'])->name('payments.plans.store');
        Route::post('/payments/transactions', [SuperAdminPaymentController::class, 'storeTransaction'])->name('payments.transactions.store');
        Route::patch('/payments/transactions/{transaction}/approve', [SuperAdminPaymentController::class, 'approve'])->name('payments.transactions.approve');
        Route::patch('/payments/transactions/{transaction}/reject', [SuperAdminPaymentController::class, 'reject'])->name('payments.transactions.reject');
        Route::redirect('/pricing', '/superadmin/payments');
        Route::get('/system', SuperAdminSystemController::class)->name('system');
        Route::post('/system/theme', [SuperAdminSystemController::class, 'updateTheme'])->name('system.theme.update');
        Route::delete('/system/theme', [SuperAdminSystemController::class, 'resetTheme'])->name('system.theme.reset');
        Route::get('/profile', fn() => Inertia::render('SuperAdmin/SuperAdminProfile'))->name('profile');
    });

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users');
        Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
        Route::get('/analytics', AdminAnalyticsController::class)->name('analytics');
        Route::get('/kanji', [AdminKanjiController::class, 'index'])->name('kanji.index');
        Route::post('/kanji', [AdminKanjiController::class, 'store'])->name('kanji.store');
        Route::put('/kanji/{kanji}', [AdminKanjiController::class, 'update'])->name('kanji.update');
        Route::delete('/kanji/{kanji}', [AdminKanjiController::class, 'destroy'])->name('kanji.destroy');
        Route::post('/kanji/import', [AdminKanjiController::class, 'import'])->name('kanji.import');
        Route::get('/kanji/autofill', [AdminKanjiController::class, 'autofill'])->name('kanji.autofill');
        Route::get('/gamification', fn() => Inertia::render('Admin/Gamification/AdminGamificationIndex', [
            'achievements' => \App\Models\Achievement::withCount('users')->orderBy('created_at', 'desc')->get(),
        ]))->name('gamification');
        Route::post('/achievements', [AdminAchievementController::class, 'store'])->name('achievements.store');
        Route::put('/achievements/{achievement}', [AdminAchievementController::class, 'update'])->name('achievements.update');
        Route::delete('/achievements/{achievement}', [AdminAchievementController::class, 'destroy'])->name('achievements.destroy');
        Route::get('/quizzes/{quiz}/builder', [AdminQuizController::class, 'builder'])->name('quizzes.builder');
        Route::post('/quizzes/{quiz}/builder', [AdminQuizController::class, 'updateQuestions'])->name('quizzes.builder.update');
        Route::post('/quizzes/{quiz}/questions/import', [AdminQuizController::class, 'importQuestions'])->name('quizzes.questions.import');
        Route::post('/quizzes/{quiz}/questions/generate-kanji', [AdminQuizController::class, 'generateKanjiQuestions'])->name('quizzes.questions.generate-kanji');

        // Level CRUD
        Route::apiResource('/levels', AdminLevelController::class)->only(['index', 'store', 'update', 'destroy']);

        // Upload Endpoint
        Route::post('/upload', [AdminUploadController::class, 'store'])->name('upload');

        // Quizzes CRUD (home/index untuk daftar kuis)
        Route::get('/quizzes', [AdminQuizController::class, 'index'])->name('quizzes.index');
        Route::post('/quizzes', [AdminQuizController::class, 'store'])->name('quizzes.store');
        Route::patch('/quizzes/{quiz}/status', [AdminQuizController::class, 'updateStatus'])->name('quizzes.status');
        Route::delete('/quizzes/{quiz}', [AdminQuizController::class, 'destroy'])->name('quizzes.destroy');

        // Module CRUD
        Route::get('/modules', [AdminModuleController::class, 'index'])->name('modules.index');
        Route::post('/modules', [AdminModuleController::class, 'store'])->name('modules.store');
        Route::get('/modules/{module}/builder', [AdminModuleController::class, 'builder'])->name('modules.builder');
        Route::post('/modules/{module}/builder', [AdminModuleController::class, 'updateContent'])->name('modules.builder.update');
        Route::post('/modules/{module}/kanji-lessons/import', [AdminModuleController::class, 'importKanjiLessons'])->name('modules.kanji-lessons.import');
        Route::put('/modules/{module}', [AdminModuleController::class, 'update'])->name('modules.update');
        Route::delete('/modules/{module}', [AdminModuleController::class, 'destroy'])->name('modules.destroy');

        // Lesson CRUD
        Route::get('/lessons', [AdminLessonController::class, 'index'])->name('lessons.index');
        Route::get('/lessons/create', [AdminLessonController::class, 'create'])->name('lessons.create');
        Route::post('/lessons', [AdminLessonController::class, 'store'])->name('lessons.store');
        Route::get('/lessons/{lesson}/edit', [AdminLessonController::class, 'edit'])->name('lessons.edit');
        Route::put('/lessons/{lesson}', [AdminLessonController::class, 'update'])->name('lessons.update');
        Route::delete('/lessons/{lesson}', [AdminLessonController::class, 'destroy'])->name('lessons.destroy');
        Route::post('/lessons/reorder', [AdminLessonController::class, 'reorder'])->name('lessons.reorder');

        // Question CRUD
        Route::get('/questions', [AdminQuestionController::class, 'index'])->name('questions.index');
        Route::get('/questions/create', [AdminQuestionController::class, 'create'])->name('questions.create');
        Route::post('/questions', [AdminQuestionController::class, 'store'])->name('questions.store');
        Route::get('/questions/{question}/edit', [AdminQuestionController::class, 'edit'])->name('questions.edit');
        Route::put('/questions/{question}', [AdminQuestionController::class, 'update'])->name('questions.update');
        Route::delete('/questions/{question}', [AdminQuestionController::class, 'destroy'])->name('questions.destroy');
        Route::post('/questions/reorder', [AdminQuestionController::class, 'reorder'])->name('questions.reorder');
        
        Route::get('/profile', fn() => Inertia::render('Admin/AdminProfile'))->name('profile');
    });

    // User Routes
    Route::middleware('role:user')->prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
        Route::get('/news', [NewsController::class, 'index'])->name('news.index');
        Route::get('/news/{news}', [NewsController::class, 'show'])->name('news.show');
        
        Route::get('/lessons', [LearningController::class, 'lessonLobby'])->name('lessons.index');
        Route::get('/lessons/{lesson}', [LearningController::class, 'showLesson'])->middleware('subscribed')->name('lessons.show');
        
        Route::get('/quizzes', [LearningController::class, 'quizLobby'])->name('quizzes.index');
        Route::get('/quizzes/{quiz}', [LearningController::class, 'showQuiz'])->middleware('subscribed')->name('quizzes.show');
        
        Route::get('/leaderboard', function () {
            $users = \App\Models\User::where('role', 'user')
                ->orderByDesc('xp')
                ->take(10)
                ->get()
                ->map(function ($user, $index) {
                    return [
                        'rank' => $index + 1,
                        'name' => $user->username,
                        'level' => 'Level ' . $user->level,
                        'xp' => $user->xp,
                        'streak' => $user->streak_count,
                        'avatar' => $user->username,
                        'isMe' => $user->id === auth()->id(),
                    ];
                });
            return Inertia::render('User/Leaderboard', ['players' => $users]);
        })->name('leaderboard');
        Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates');
        Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');
        Route::get('/progress', [ProgressController::class, 'index'])->name('progress');
        
        Route::post('/attempts', [ProgressController::class, 'storeAttempt'])->name('attempts.store');
        Route::post('/lessons/complete', [ProgressController::class, 'completeLesson'])->name('lessons.complete');
    });
});

require __DIR__.'/auth.php';
