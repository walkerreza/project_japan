<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function lessonLobby()
    {
        $user = Auth::user();
        
        $lessons = Lesson::with('module.level')
            ->where('status', 'published')
            ->whereHas('module', fn ($query) => $query->where('status', 'published'))
            ->orderBy('module_id')
            ->orderBy('order')
            ->get();
        $completedLessonIds = $user->progress()->pluck('lesson_id')->toArray();

        $formattedLessons = $lessons->map(function ($lesson, $index) use ($completedLessonIds, $lessons, $user) {
            $isCompleted = in_array($lesson->id, $completedLessonIds);
            
            // Unlocked if it's the first lesson, or if it is completed, or if the previous lesson in the list is completed.
            $isLocked = true;
            if ($index === 0 || $isCompleted) {
                $isLocked = false;
            } else {
                $previousLesson = $lessons[$index - 1];
                if (in_array($previousLesson->id, $completedLessonIds)) {
                    $isLocked = false;
                }
            }
            
            $isPremium = $lesson->module && $lesson->module->level ? $lesson->module->level->is_premium : false;
            $isLockedBySubscription = $isPremium && $user->subscription_status !== 'premium';

            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => 'Materi ' . $lesson->type . ' dari modul ' . ($lesson->module ? $lesson->module->title : 'Umum'),
                'durationEstimate' => $lesson->duration_minutes . ' Menit',
                'totalPages' => 1,
                'level' => $lesson->module && $lesson->module->level ? $lesson->module->level->level_name : 'General',
                'isPremium' => $isPremium,
                'status' => ($isLocked || $isLockedBySubscription) ? 'locked' : 'available',
                'lockReason' => $isLockedBySubscription ? 'premium' : ($isLocked ? 'progress' : null),
            ];
        });

        return Inertia::render('User/LessonLobby', [
            'lessons' => $formattedLessons,
        ]);
    }

    public function quizLobby()
    {
        $user = Auth::user();
        
        $quizzes = Quiz::with('lesson.module.level')
            ->withCount('questions')
            ->where('status', 'published')
            ->whereHas('lesson', fn ($query) => $query->where('status', 'published')->whereHas('module', fn ($query) => $query->where('status', 'published')))
            ->get();
        $completedLessonIds = $user->progress()->pluck('lesson_id')->toArray();

        $formattedQuizzes = $quizzes->map(function ($quiz) use ($completedLessonIds, $user) {
            $isLocked = true;
            if ($quiz->lesson_id === null || in_array($quiz->lesson_id, $completedLessonIds)) {
                $isLocked = false;
            }
            
            $isPremium = $quiz->lesson && $quiz->lesson->module && $quiz->lesson->module->level ? $quiz->lesson->module->level->is_premium : false;
            $isLockedBySubscription = $isPremium && $user->subscription_status !== 'premium';

            return [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description ?? 'Kuis evaluasi pemahaman materi.',
                'xpReward' => 50, // Base XP as defined in rules
                'durationEstimate' => $quiz->time_limit ? $quiz->time_limit . ' Menit' : '10 Menit',
                'totalQuestions' => $quiz->questions_count,
                'level' => $quiz->lesson && $quiz->lesson->module && $quiz->lesson->module->level ? $quiz->lesson->module->level->level_name : 'General',
                'isPremium' => $isPremium,
                'status' => ($isLocked || $isLockedBySubscription) ? 'locked' : 'available',
                'lockReason' => $isLockedBySubscription ? 'premium' : ($isLocked ? 'progress' : null),
            ];
        });

        return Inertia::render('User/QuizLobby', [
            'quizzes' => $formattedQuizzes,
        ]);
    }

    public function showLesson($id)
    {
        $lesson = Lesson::with(['module.lessons' => function ($q) {
            $q->where('status', 'published')->orderBy('order');
        }])
            ->where('status', 'published')
            ->whereHas('module', fn ($query) => $query->where('status', 'published'))
            ->find($id);

        if (!$lesson) {
            abort(404, 'Lesson tidak ditemukan.');
        }

        $user = Auth::user();

        // Ambil progress user untuk semua lesson dalam modul ini
        $completedLessonIds = $user->progress()
            ->whereIn('lesson_id', $lesson->module->lessons->pluck('id'))
            ->pluck('lesson_id')
            ->toArray();

        // Tentukan lesson yang tersedia (unlock): sudah selesai atau lesson pertama / lesson berikutnya
        $lessons = $lesson->module->lessons->map(function ($l, $index) use ($completedLessonIds, $lesson) {
            $isCompleted = in_array($l->id, $completedLessonIds);
            $isActive    = $l->id === $lesson->id;
            // Unlock: completed, aktif, atau index 0
            $isLocked    = !$isCompleted && !$isActive && $index !== 0;

            return [
                'id'               => $l->id,
                'title'            => $l->title,
                'type'             => $l->type,
                'duration_minutes' => $l->duration_minutes,
                'order'            => $l->order,
                'is_completed'     => $isCompleted,
                'is_active'        => $isActive,
                'is_locked'        => $isLocked,
            ];
        });

        return Inertia::render('User/Lesson', [
            'lesson'  => [
                'id'               => $lesson->id,
                'title'            => $lesson->title,
                'content'          => $lesson->content,
                'type'             => $lesson->type,
                'video_url'        => $lesson->video_url,
                'file_url'         => $lesson->file_url,
                'audio_url'        => $lesson->audio_url,
                'duration_minutes' => $lesson->duration_minutes,
                'module'           => [
                    'id'    => $lesson->module->id,
                    'title' => $lesson->module->title,
                ],
            ],
            'lessons'      => $lessons,
            'is_completed' => in_array($lesson->id, $completedLessonIds),
        ]);
    }

    public function showQuiz($id)
    {
        $quiz = Quiz::with(['lesson.module', 'questions'])
            ->where('status', 'published')
            ->whereHas('lesson', fn ($query) => $query->where('status', 'published')->whereHas('module', fn ($query) => $query->where('status', 'published')))
            ->find($id);

        if (!$quiz) {
            abort(404, 'Quiz tidak ditemukan.');
        }

        $questions = $quiz->questions->map(fn($q) => [
            'id'             => $q->id,
            'question'       => $q->question_text, // Map to question for UI
            'kanji'          => '', // We don't have separate kanji field currently, can be empty or parse from text
            'type'           => $q->type,
            'options'        => $q->options, // JSON column, auto-cast array
            'correct_answer' => $q->correct_answer,
            'explanation'    => $q->explanation,
            'audio_url'      => $q->audio_url,
        ]);

        return Inertia::render('User/Quiz', [
            'quiz' => [
                'id'         => $quiz->id,
                'type'       => $quiz->type,
                'time_limit' => $quiz->time_limit,
                'lesson'     => [
                    'id'    => $quiz->lesson->id,
                    'title' => $quiz->lesson->title,
                ],
            ],
            'questions' => $questions,
        ]);
    }
}
