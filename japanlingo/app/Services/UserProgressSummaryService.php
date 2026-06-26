<?php

namespace App\Services;

use App\Models\Attempt;
use App\Models\Lesson;
use App\Models\Level;
use App\Models\Progress;
use App\Models\Quiz;
use App\Models\RewardLog;
use App\Models\User;
use Illuminate\Support\Collection;

class UserProgressSummaryService
{
    public function summary(User $user): array
    {
        $completedLessonIds = Progress::where('user_id', $user->id)->pluck('lesson_id')->all();
        $attemptedQuizIds = Attempt::where('user_id', $user->id)->pluck('quiz_id')->unique()->all();
        $lessonsDone = count($completedLessonIds);
        $quizzesDone = count($attemptedQuizIds);
        $completedLessons = Lesson::whereIn('id', $completedLessonIds)->get(['id', 'title']);
        $completedQuizzes = Quiz::with('lesson:id,title')->whereIn('id', $attemptedQuizIds)->get(['id', 'lesson_id', 'type']);

        return [
            'stats' => [
                'xp' => number_format($user->xp),
                'streak' => $user->streak_count,
                'lessonsDone' => $lessonsDone,
                'quizzesDone' => $quizzesDone,
            ],
            'weekActivity' => $this->weekActivity($user),
            'jlptJourney' => $this->jlptJourney($completedLessonIds),
            'recentActivity' => $this->recentActivity($user),
            'skills' => $this->skills($lessonsDone, $quizzesDone, $completedLessons, $completedQuizzes),
        ];
    }

    private function weekActivity(User $user): Collection
    {
        $start = now()->subDays(6)->startOfDay();
        $end = now()->endOfDay();
        $xpByDate = RewardLog::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DATE(created_at) as activity_date, SUM(xp_amount) as total_xp')
            ->groupByRaw('DATE(created_at)')
            ->pluck('total_xp', 'activity_date');

        return collect(range(6, 1))
            ->map(fn ($daysAgo) => now()->subDays($daysAgo))
            ->push(now())
            ->map(function ($date, $index) use ($xpByDate) {
                $key = $date->toDateString();
                $xp = (int) ($xpByDate[$key] ?? 0);

                return [
                    'day' => $date->translatedFormat('D'),
                    'xp' => $xp,
                    'height' => $xp > 0 ? min(100, max(10, ($xp / 500) * 100)) . '%' : '0%',
                    'today' => $index === 6,
                ];
            });
    }

    private function jlptJourney(array $completedLessonIds): Collection
    {
        $completed = array_flip($completedLessonIds);

        return Level::with(['modules.lessons:id,module_id'])
            ->orderBy('stage')
            ->get()
            ->map(function (Level $level) use ($completed) {
                $lessonIds = $level->modules->flatMap->lessons->pluck('id');
                $totalLessons = $lessonIds->count();
                $completedCount = $lessonIds->filter(fn ($id) => isset($completed[$id]))->count();
                $pct = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;

                return [
                    'level' => $level->level_name,
                    'pct' => $pct,
                    'done' => $pct === 100 && $totalLessons > 0,
                ];
            });
    }

    private function recentActivity(User $user): Collection
    {
        return RewardLog::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (RewardLog $log) => [
                'text' => $log->description,
                'xp' => '+' . $log->xp_amount . ' XP',
                'time' => $log->created_at->diffForHumans(),
                'type' => $log->source_type,
            ]);
    }

    private function skills(int $lessonsDone, int $quizzesDone, Collection $lessons, Collection $quizzes): array
    {
        $grammarCount = $lessonsDone * 5;
        $kanjiCount = $lessonsDone * 2;
        $vocabCount = $lessonsDone * 8;
        $listenCount = $quizzesDone * 5;
        $readCount = ($lessonsDone * 3) + ($quizzesDone * 3);

        $grammarCount += $lessons->filter(fn ($lesson) => $this->titleContains($lesson->title, ['grammar', 'partikel', 'pola']))->count() * 15;
        $kanjiCount += $lessons->filter(fn ($lesson) => $this->titleContains($lesson->title, ['kanji']))->count() * 15;
        $vocabCount += $lessons->filter(fn ($lesson) => $this->titleContains($lesson->title, ['vocab', 'kosakata']))->count() * 15;
        $listenCount += $lessons->filter(fn ($lesson) => $this->titleContains($lesson->title, ['listen', 'audio']))->count() * 20;
        $readCount += $lessons->filter(fn ($lesson) => $this->titleContains($lesson->title, ['read', 'baca', 'dokkai']))->count() * 15;

        $grammarCount += $quizzes->filter(fn ($quiz) => $this->titleContains($this->quizSkillText($quiz), ['grammar', 'partikel']))->count() * 10;
        $vocabCount += $quizzes->filter(fn ($quiz) => $this->titleContains($this->quizSkillText($quiz), ['vocab', 'kosakata']))->count() * 10;
        $kanjiCount += $quizzes->filter(fn ($quiz) => $this->titleContains($this->quizSkillText($quiz), ['kanji']))->count() * 10;

        return [
            ['label' => 'Grammar', 'value' => min(100, $grammarCount), 'color' => 'bg-red-500'],
            ['label' => 'Kanji', 'value' => min(100, $kanjiCount), 'color' => 'bg-blue-500'],
            ['label' => 'Vocabulary', 'value' => min(100, $vocabCount), 'color' => 'bg-green-500'],
            ['label' => 'Listening', 'value' => min(100, $listenCount), 'color' => 'bg-amber-500'],
            ['label' => 'Reading', 'value' => min(100, $readCount), 'color' => 'bg-purple-500'],
        ];
    }

    private function titleContains(string $title, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (stripos($title, $needle) !== false) {
                return true;
            }
        }

        return false;
    }

    private function quizSkillText(Quiz $quiz): string
    {
        return trim($quiz->type . ' ' . ($quiz->lesson?->title ?? ''));
    }
}
