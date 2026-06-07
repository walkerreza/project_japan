<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Attempt;
use App\Models\Progress;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $activeUsers = User::where('role', 'user')
            ->where(function ($query) {
                $query->whereHas('progress', fn ($query) => $query->where('updated_at', '>=', now()->subDays(7)))
                    ->orWhereHas('attempts', fn ($query) => $query->where('attempted_at', '>=', now()->subDays(7)));
            })
            ->count();

        return Inertia::render('Admin/Beranda', [
            'totalModules'   => Module::count(),
            'totalLessons'   => Lesson::count(),
            'totalQuizzes'   => Quiz::count(),
            'totalQuestions' => Question::count(),
            'totalUsers'     => User::where('role', 'user')->count(),
            'activeUsers'    => $activeUsers,
            'completedLessons' => Progress::count(),
            'totalAttempts' => Attempt::count(),
            'averageScore' => round((float) Attempt::avg('score'), 1),
            'popularModules' => Module::query()
                ->select('modules.id', 'modules.title')
                ->selectRaw('COUNT(progress.id) as completions_count')
                ->leftJoin('lessons', 'lessons.module_id', '=', 'modules.id')
                ->leftJoin('progress', 'progress.lesson_id', '=', 'lessons.id')
                ->groupBy('modules.id', 'modules.title')
                ->orderByDesc('completions_count')
                ->take(5)
                ->get(),
            'recentAttempts' => Attempt::with(['user:id,username', 'quiz.lesson'])
                ->latest('attempted_at')
                ->take(5)
                ->get()
                ->map(fn (Attempt $attempt) => [
                    'id' => $attempt->id,
                    'student' => $attempt->user?->username,
                    'lesson' => $attempt->quiz?->lesson?->title,
                    'score' => $attempt->score,
                    'attempted_at' => optional($attempt->attempted_at)->format('d M Y H:i'),
                ]),
        ]);
    }
}
