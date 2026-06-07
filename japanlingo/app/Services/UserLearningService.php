<?php

namespace App\Services;

use App\Models\FlashcardSet;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\TeachingBoard;
use App\Models\User;
use Illuminate\Support\Collection;

class UserLearningService
{
    public function lessonLobby(User $user): Collection
    {
        $lessons = Lesson::with('module.level')
            ->where('status', 'published')
            ->whereHas('module', fn ($query) => $query->where('status', 'published'))
            ->orderBy('module_id')
            ->orderBy('order')
            ->get();

        $completedLessonIds = $this->completedLessonIds($user);

        return $lessons->map(function (Lesson $lesson, int $index) use ($lessons, $completedLessonIds, $user) {
            $isCompleted = in_array($lesson->id, $completedLessonIds, true);
            $previousLesson = $index > 0 ? $lessons[$index - 1] : null;
            $isProgressLocked = ! $isCompleted
                && $index !== 0
                && ! ($previousLesson && in_array($previousLesson->id, $completedLessonIds, true));
            $isPremium = (bool) ($lesson->module?->level?->is_premium);
            $isSubscriptionLocked = $isPremium && $user->subscription_status !== 'premium';

            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => 'Materi ' . $lesson->type . ' dari modul ' . ($lesson->module?->title ?? 'Umum'),
                'durationEstimate' => $lesson->duration_minutes . ' Menit',
                'totalPages' => 1,
                'level' => $lesson->module?->level?->level_name ?? 'General',
                'isPremium' => $isPremium,
                'status' => ($isProgressLocked || $isSubscriptionLocked) ? 'locked' : 'available',
                'lockReason' => $isSubscriptionLocked ? 'premium' : ($isProgressLocked ? 'progress' : null),
            ];
        });
    }

    public function quizLobby(User $user): Collection
    {
        $quizzes = Quiz::with('lesson.module.level')
            ->withCount('questions')
            ->where('status', 'published')
            ->whereHas('lesson', fn ($query) => $query
                ->where('status', 'published')
                ->whereHas('module', fn ($moduleQuery) => $moduleQuery->where('status', 'published')))
            ->get();
        $completedLessonIds = $this->completedLessonIds($user);

        return $quizzes->map(function (Quiz $quiz) use ($completedLessonIds, $user) {
            $isProgressLocked = $quiz->lesson_id !== null && ! in_array($quiz->lesson_id, $completedLessonIds, true);
            $isPremium = (bool) ($quiz->lesson?->module?->level?->is_premium);
            $isSubscriptionLocked = $isPremium && $user->subscription_status !== 'premium';

            return [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description ?? 'Kuis evaluasi pemahaman materi.',
                'xpReward' => 50,
                'durationEstimate' => $quiz->time_limit ? $quiz->time_limit . ' Menit' : '10 Menit',
                'totalQuestions' => $quiz->questions_count,
                'level' => $quiz->lesson?->module?->level?->level_name ?? 'General',
                'isPremium' => $isPremium,
                'status' => ($isProgressLocked || $isSubscriptionLocked) ? 'locked' : 'available',
                'lockReason' => $isSubscriptionLocked ? 'premium' : ($isProgressLocked ? 'progress' : null),
            ];
        });
    }

    public function lessonDetailPayload(User $user, Lesson $lesson): array
    {
        $completedLessonIds = $user->progress()
            ->whereIn('lesson_id', $lesson->module->lessons->pluck('id'))
            ->pluck('lesson_id')
            ->all();

        return [
            'lesson' => $this->lessonPayload($lesson),
            'lessons' => $this->moduleLessonsPayload($lesson, $completedLessonIds),
            'is_completed' => in_array($lesson->id, $completedLessonIds, true),
            'boards' => $this->lessonBoards($lesson),
        ];
    }

    public function canOpenLesson(User $user, Lesson $lesson): bool
    {
        $completedLessonIds = $user->progress()
            ->whereIn('lesson_id', $lesson->module->lessons->pluck('id'))
            ->pluck('lesson_id')
            ->all();
        $currentIndex = $lesson->module->lessons->search(fn ($item) => $item->id === $lesson->id);
        $previousLesson = $currentIndex > 0 ? $lesson->module->lessons[$currentIndex - 1] : null;

        return ! $previousLesson
            || in_array($previousLesson->id, $completedLessonIds, true)
            || in_array($lesson->id, $completedLessonIds, true);
    }

    public function quizPayload(User $user, Quiz $quiz): array
    {
        return [
            'quiz' => [
                'id' => $quiz->id,
                'type' => $quiz->type,
                'time_limit' => $quiz->time_limit,
                'lesson' => [
                    'id' => $quiz->lesson->id,
                    'title' => $quiz->lesson->title,
                ],
            ],
            'questions' => $quiz->questions->map(fn ($question) => [
                'id' => $question->id,
                'question' => $question->question_text,
                'kanji' => '',
                'type' => $question->type,
                'options' => $question->options,
                'correct_answer' => $question->correct_answer,
                'explanation' => $question->explanation,
                'audio_url' => $question->audio_url,
            ]),
            'flashcards' => $this->quizFlashcards($quiz),
        ];
    }

    public function hasCompletedLesson(User $user, ?int $lessonId): bool
    {
        if (! $lessonId) {
            return true;
        }

        return $user->progress()->where('lesson_id', $lessonId)->exists();
    }

    private function completedLessonIds(User $user): array
    {
        return $user->progress()->pluck('lesson_id')->all();
    }

    private function lessonPayload(Lesson $lesson): array
    {
        return [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'content' => $lesson->content,
            'type' => $lesson->type,
            'video_url' => $lesson->video_url,
            'file_url' => $lesson->file_url,
            'audio_url' => $lesson->audio_url,
            'duration_minutes' => $lesson->duration_minutes,
            'module' => [
                'id' => $lesson->module->id,
                'title' => $lesson->module->title,
            ],
        ];
    }

    private function moduleLessonsPayload(Lesson $activeLesson, array $completedLessonIds): Collection
    {
        return $activeLesson->module->lessons->map(function (Lesson $lesson, int $index) use ($completedLessonIds, $activeLesson) {
            $isCompleted = in_array($lesson->id, $completedLessonIds, true);
            $isActive = $lesson->id === $activeLesson->id;

            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'type' => $lesson->type,
                'duration_minutes' => $lesson->duration_minutes,
                'order' => $lesson->order,
                'is_completed' => $isCompleted,
                'is_active' => $isActive,
                'is_locked' => ! $isCompleted && ! $isActive && $index !== 0,
            ];
        });
    }

    private function quizFlashcards(Quiz $quiz): Collection
    {
        $lessonId = $quiz->lesson_id;
        $moduleId = $quiz->lesson?->module_id;
        $levelId = $quiz->lesson?->module?->level_id;

        $sets = FlashcardSet::with('flashcards')
            ->where('status', 'published')
            ->whereHas('flashcards')
            ->where(function ($query) use ($lessonId, $moduleId, $levelId) {
                $query->where('lesson_id', $lessonId);

                if ($moduleId) {
                    $query->orWhere('module_id', $moduleId);
                }

                if ($levelId) {
                    $query->orWhere('level_id', $levelId);
                }
            })
            ->get()
            ->sortBy(function (FlashcardSet $set) use ($lessonId, $moduleId, $levelId) {
                return match (true) {
                    $set->lesson_id === $lessonId => 1,
                    $moduleId && $set->module_id === $moduleId => 2,
                    $levelId && $set->level_id === $levelId => 3,
                    default => 4,
                };
            });

        return $sets
            ->flatMap(fn (FlashcardSet $set) => $set->flashcards)
            ->unique('id')
            ->take(5)
            ->values()
            ->map(fn ($card) => [
                'id' => $card->id,
                'front_text' => $card->front_text,
                'reading' => $card->reading,
                'back_text' => $card->back_text,
                'hint' => $card->hint,
                'example_sentence' => $card->example_sentence,
                'example_meaning' => $card->example_meaning,
                'audio_url' => $card->audio_url,
            ]);
    }

    private function lessonBoards(Lesson $lesson): Collection
    {
        $lessonBoards = TeachingBoard::query()
            ->where('status', 'published')
            ->where('lesson_id', $lesson->id)
            ->latest()
            ->get();

        $moduleBoards = TeachingBoard::query()
            ->where('status', 'published')
            ->whereNull('lesson_id')
            ->where('module_id', $lesson->module_id)
            ->latest()
            ->get();

        return $lessonBoards
            ->concat($moduleBoards)
            ->map(fn (TeachingBoard $board) => [
                'id' => $board->id,
                'title' => $board->title,
                'description' => $board->description,
                'board_data' => $board->board_data ?: ['strokes' => []],
                'snapshot_data' => $board->snapshot_data,
                'updated_at' => $board->updated_at?->diffForHumans(),
            ]);
    }
}
