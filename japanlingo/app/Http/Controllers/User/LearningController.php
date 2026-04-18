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
    public function showLesson($id)
    {
        $lesson = Lesson::with(['module.lessons' => function ($q) {
            $q->orderBy('order');
        }])->find($id);

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
        $quiz = Quiz::with(['lesson', 'questions'])->find($id);

        if (!$quiz) {
            abort(404, 'Quiz tidak ditemukan.');
        }

        $questions = $quiz->questions->map(fn($q) => [
            'id'             => $q->id,
            'question_text'  => $q->question_text,
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
