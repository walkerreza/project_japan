<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function showLesson($id)
    {
        // Bypass Model Binding sementara:
        // Supaya tidak 404 jika table database 'lessons' masih kosong saat mendevelop Frontend UI
        $lesson = Lesson::with('module')->find($id);

        if (!$lesson) {
            $lesson = new Lesson(['id' => $id, 'title' => 'Mock Lesson (Testing UI)']);
        }

        return Inertia::render('User/Lesson', [
            'lesson' => $lesson,
            'quizzes' => [] // Mock fallback array kosong
        ]);
    }

    public function showQuiz($id)
    {
        // Bypass Model Binding sementara:
        // Supaya tidak 404 jika table database 'quizzes' masih kosong saat mendevelop Frontend UI
        $quiz = Quiz::with(['lesson', 'questions'])->find($id);

        if (!$quiz) {
            $quiz = new Quiz(['id' => $id, 'title' => 'Mock Quiz (Testing UI)']);
        }

        return Inertia::render('User/Quiz', [
            'quiz' => $quiz
        ]);
    }
}
