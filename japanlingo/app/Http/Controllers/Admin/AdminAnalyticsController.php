<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Module;
use App\Models\Question;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminAnalyticsController extends Controller
{
    public function __invoke()
    {
        $lowScoreQuizzes = Attempt::query()
            ->select('quiz_id', DB::raw('AVG(score) as average_score'), DB::raw('COUNT(*) as attempts_count'))
            ->with('quiz.lesson.module')
            ->groupBy('quiz_id')
            ->havingRaw('COUNT(*) > 0')
            ->orderBy('average_score')
            ->take(8)
            ->get()
            ->map(fn (Attempt $attempt) => [
                'quiz_id' => $attempt->quiz_id,
                'quiz_type' => $attempt->quiz?->type,
                'lesson' => $attempt->quiz?->lesson?->title,
                'module' => $attempt->quiz?->lesson?->module?->title,
                'average_score' => round((float) $attempt->average_score, 1),
                'attempts_count' => (int) $attempt->attempts_count,
            ]);

        $popularModules = Module::query()
            ->select('modules.id', 'modules.title', DB::raw('COUNT(progress.id) as completions_count'))
            ->leftJoin('lessons', 'lessons.module_id', '=', 'modules.id')
            ->leftJoin('progress', 'progress.lesson_id', '=', 'lessons.id')
            ->groupBy('modules.id', 'modules.title')
            ->orderByDesc('completions_count')
            ->take(8)
            ->get();

        $inactiveStudents = User::query()
            ->where('role', 'user')
            ->withMax('progress as last_lesson_activity', 'updated_at')
            ->withMax('attempts as last_quiz_activity', 'attempted_at')
            ->get()
            ->map(function (User $student) {
                $lastActivity = collect([
                    $student->last_lesson_activity,
                    $student->last_quiz_activity,
                    $student->last_activity_date,
                ])->filter()->max();

                return [
                    'id' => $student->id,
                    'username' => $student->username,
                    'email' => $student->email,
                    'last_activity' => $lastActivity,
                    'last_activity_label' => $lastActivity ? date('d M Y', strtotime($lastActivity)) : 'Belum aktif',
                    'xp' => (int) $student->xp,
                ];
            })
            ->filter(fn ($student) => ! $student['last_activity'] || strtotime($student['last_activity']) < now()->subDays(7)->timestamp)
            ->sortBy('last_activity')
            ->values();

        $inactiveStudentsCount = $inactiveStudents->count();

        $inactiveStudents = $inactiveStudents
            ->take(8)
            ->values();

        $recentAttempts = Attempt::with(['user:id,username,email', 'quiz.lesson'])
            ->latest('attempted_at')
            ->take(10)
            ->get()
            ->map(fn (Attempt $attempt) => [
                'id' => $attempt->id,
                'student' => $attempt->user?->username,
                'lesson' => $attempt->quiz?->lesson?->title,
                'quiz_type' => $attempt->quiz?->type,
                'score' => $attempt->score,
                'xp_earned' => $attempt->xp_earned,
                'attempted_at' => optional($attempt->attempted_at)->format('d M Y H:i'),
            ]);

        $questionPerformance = Question::query()
            ->with('quiz.lesson.module')
            ->withCount([
                'attemptAnswers as attempts_count',
                'attemptAnswers as correct_count' => fn ($query) => $query->where('is_correct', true),
            ])
            ->get()
            ->filter(fn (Question $question) => $question->attempts_count > 0)
            ->map(function (Question $question) {
                $correctRate = $question->attempts_count > 0
                    ? round(($question->correct_count / $question->attempts_count) * 100, 1)
                    : 0;

                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'quiz_type' => $question->quiz?->type,
                    'lesson' => $question->quiz?->lesson?->title,
                    'module' => $question->quiz?->lesson?->module?->title,
                    'attempts_count' => (int) $question->attempts_count,
                    'correct_count' => (int) $question->correct_count,
                    'correct_rate' => $correctRate,
                ];
            })
            ->sortBy('correct_rate')
            ->take(12)
            ->values();

        return Inertia::render('Admin/Analitik/Analitik', [
            'summary' => [
                'total_students' => User::where('role', 'user')->count(),
                'total_attempts' => Attempt::count(),
                'average_score' => round((float) Attempt::avg('score'), 1),
                'inactive_students' => $inactiveStudentsCount,
            ],
            'lowScoreQuizzes' => $lowScoreQuizzes,
            'popularModules' => $popularModules,
            'inactiveStudents' => $inactiveStudents,
            'recentAttempts' => $recentAttempts,
            'questionPerformance' => $questionPerformance,
        ]);
    }
}
