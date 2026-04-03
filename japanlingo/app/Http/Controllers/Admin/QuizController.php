<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::with(['lesson:id,title'])->withCount('questions');

        if ($request->filled('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        $quizzes = $query->get()->map(fn($q) => [
            'id'             => $q->id,
            'type'           => $q->type,
            'time_limit'     => $q->time_limit,
            'question_count' => $q->questions_count,
            'lesson'         => $q->lesson,
        ]);

        $lessons = Lesson::orderBy('order')->get(['id', 'title']);

        return Inertia::render('Admin/Quizzes/Index', [
            'quizzes' => $quizzes,
            'lessons' => $lessons,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lesson_id'  => 'required|exists:lessons,id',
            'type'       => 'required|in:multiple_choice,typing,listening',
            'time_limit' => 'nullable|integer|min:0',
        ], [
            'lesson_id.required' => 'Pelajaran wajib dipilih',
            'type.required'      => 'Tipe kuis wajib dipilih',
            'type.in'            => 'Tipe kuis tidak valid',
        ]);

        Quiz::create($validated);

        return redirect()->back()->with('success', 'Kuis berhasil dibuat');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete(); // cascade hapus questions juga
        return redirect()->back()->with('success', 'Kuis berhasil dihapus');
    }
}
