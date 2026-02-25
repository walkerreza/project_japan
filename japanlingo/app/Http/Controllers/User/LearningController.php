<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function showLesson(Lesson $lesson)
    {
        return Inertia::render('User/Lesson', [
            'lesson' => $lesson->load('module'),
            'quizzes' => $lesson->quizzes
        ]);
    }

    public function showQuiz(Quiz $quiz)
    {
        return Inertia::render('User/Quiz', [
            'quiz' => $quiz->load(['lesson', 'questions'])
        ]);
    }
}
