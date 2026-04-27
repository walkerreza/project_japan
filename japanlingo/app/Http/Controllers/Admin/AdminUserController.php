<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Level;
use App\Models\Progress;
use App\Models\RewardLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $search = (string) $request->string('search');

        $students = User::query()
            ->where('role', 'user')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->withCount([
                'progress as lessons_done',
                'attempts as quizzes_done',
            ])
            ->withAvg('attempts as average_score', 'score')
            ->withMax('progress as last_lesson_activity', 'updated_at')
            ->withMax('attempts as last_quiz_activity', 'attempted_at')
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (User $student) => $this->mapStudent($student));

        return Inertia::render('Admin/Users/AdminUsersIndex', [
            'students' => $students,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(User $user)
    {
        abort_unless($user->role === 'user', 404);

        $user->load([
            'progress.lesson.module.level',
            'attempts.quiz.lesson.module.level',
            'certificates.level',
            'achievements',
        ]);

        $completedLessonIds = $user->progress->pluck('lesson_id')->all();
        $levels = Level::with('modules.lessons')->orderBy('stage')->get();

        $levelProgress = $levels->map(function (Level $level) use ($completedLessonIds) {
            $lessons = $level->modules->flatMap->lessons;
            $total = $lessons->count();
            $completed = $lessons->whereIn('id', $completedLessonIds)->count();

            return [
                'id' => $level->id,
                'name' => $level->level_name,
                'total_lessons' => $total,
                'completed_lessons' => $completed,
                'percentage' => $total > 0 ? round(($completed / $total) * 100) : 0,
            ];
        });

        return Inertia::render('Admin/Users/AdminUsersShow', [
            'student' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'status' => $user->status,
                'subscription_status' => $user->subscription_status,
                'xp' => (int) $user->xp,
                'level' => (int) $user->level,
                'streak_count' => (int) $user->streak_count,
                'lessons_done' => $user->progress->count(),
                'quizzes_done' => $user->attempts->count(),
                'average_score' => round((float) $user->attempts->avg('score'), 1),
            ],
            'levelProgress' => $levelProgress,
            'recentProgress' => $user->progress
                ->sortByDesc('updated_at')
                ->take(10)
                ->values()
                ->map(fn (Progress $progress) => [
                    'id' => $progress->id,
                    'lesson' => $progress->lesson?->title,
                    'module' => $progress->lesson?->module?->title,
                    'level' => $progress->lesson?->module?->level?->level_name,
                    'score' => $progress->score,
                    'completed_at' => optional($progress->completed_at ?? $progress->updated_at)->format('d M Y H:i'),
                ]),
            'recentAttempts' => $user->attempts
                ->sortByDesc('attempted_at')
                ->take(10)
                ->values()
                ->map(fn (Attempt $attempt) => [
                    'id' => $attempt->id,
                    'quiz' => $attempt->quiz?->type,
                    'lesson' => $attempt->quiz?->lesson?->title,
                    'module' => $attempt->quiz?->lesson?->module?->title,
                    'score' => $attempt->score,
                    'xp_earned' => $attempt->xp_earned,
                    'attempted_at' => optional($attempt->attempted_at)->format('d M Y H:i'),
                ]),
            'rewardHistory' => RewardLog::where('user_id', $user->id)
                ->latest()
                ->take(10)
                ->get()
                ->map(fn (RewardLog $log) => [
                    'id' => $log->id,
                    'description' => $log->description,
                    'source_type' => $log->source_type,
                    'xp_amount' => $log->xp_amount,
                    'created_at' => $log->created_at->format('d M Y H:i'),
                ]),
            'certificates' => $user->certificates->map(fn ($certificate) => [
                'id' => $certificate->id,
                'level' => $certificate->level?->level_name,
                'certificate_number' => $certificate->certificate_number,
                'issued_at' => optional($certificate->issued_at)->format('d M Y'),
            ]),
        ]);
    }

    private function mapStudent(User $student): array
    {
        $lastActivity = collect([
            $student->last_lesson_activity,
            $student->last_quiz_activity,
            $student->last_activity_date,
        ])->filter()->max();

        return [
            'id' => $student->id,
            'username' => $student->username,
            'email' => $student->email,
            'status' => $student->status,
            'subscription_status' => $student->subscription_status,
            'xp' => (int) $student->xp,
            'level' => (int) $student->level,
            'streak_count' => (int) $student->streak_count,
            'lessons_done' => (int) $student->lessons_done,
            'quizzes_done' => (int) $student->quizzes_done,
            'average_score' => round((float) $student->average_score, 1),
            'last_activity' => $lastActivity ? date('d M Y H:i', strtotime($lastActivity)) : 'Belum aktif',
        ];
    }
}
