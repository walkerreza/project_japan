<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Lesson;
use App\Http\Requests\Admin\QuizRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminQuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::with(['lesson:id,title'])->withCount('questions');

        if ($request->filled('search')) {
            $query->whereHas('lesson', function($q) use ($request) {
                $q->where('title', 'ilike', '%' . $request->search . '%');
            })->orWhere('type', 'ilike', '%' . $request->search . '%');
        }

        if ($request->filled('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        $quizzes = $query->paginate(10)->through(fn($q) => [
            'id'             => $q->id,
            'type'           => $q->type,
            'time_limit'     => $q->time_limit,
            'status'         => $q->status ?? 'published',
            'question_count' => $q->questions_count,
            'lesson'         => $q->lesson,
        ]);

        $lessons = Lesson::orderBy('order')->get(['id', 'title']);

        return Inertia::render('Admin/Quizzes/AdminQuizzesIndex', [
            'quizzes' => $quizzes,
            'lessons' => $lessons,
            'filters' => $request->only('search', 'lesson_id'),
        ]);
    }

    public function store(QuizRequest $request)
    {
        $validated = $request->validated();
        Quiz::create($validated);
        return redirect()->back()->with('success', 'Kuis berhasil dibuat');
    }

    public function updateStatus(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:draft,published'],
        ]);

        $quiz->update($validated);

        return redirect()->back()->with('success', 'Status kuis berhasil diperbarui');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return redirect()->back()->with('success', 'Kuis berhasil dihapus');
    }

    public function builder(Quiz $quiz)
    {
        $quiz->load(['lesson:id,title', 'questions' => fn($q) => $q->orderBy('order')]);

        return Inertia::render('Admin/Builders/AdminQuizBuilder', [
            'quiz' => [
                'id'         => $quiz->id,
                'type'       => $quiz->type,
                'time_limit' => $quiz->time_limit,
                'status'     => $quiz->status ?? 'published',
                'lesson'     => $quiz->lesson,
            ],
            'questions' => $quiz->questions->map(fn($q) => [
                'id'             => $q->id,
                'question_text'  => $q->question_text,
                'correct_answer' => $q->correct_answer,
                'options'        => $q->options ?? [],
                'explanation'    => $q->explanation,
                'audio_url'      => $q->audio_url,
                'order'          => $q->order,
            ]),
        ]);
    }

    public function updateQuestions(Request $request, Quiz $quiz)
    {
        $request->validate([
            'questions'                  => 'required|array',
            'questions.*.question_text'  => 'required|string',
            'questions.*.correct_answer' => 'required|string',
            'questions.*.options'        => 'nullable|array',
            'questions.*.explanation'    => 'nullable|string',
            'questions.*.audio_url'      => 'nullable|string',
        ]);

        $questionIds = [];

        foreach ($request->questions as $index => $data) {
            $question = $quiz->questions()->updateOrCreate(
                ['id' => $data['id'] ?? null],
                [
                    'question_text'  => $data['question_text'],
                    'correct_answer' => $data['correct_answer'],
                    'options'        => $data['options'] ?? null,
                    'explanation'    => $data['explanation'] ?? null,
                    'audio_url'      => $data['audio_url'] ?? null,
                    'order'          => $index,
                ]
            );
            $questionIds[] = $question->id;
        }

        $quiz->questions()->whereNotIn('id', $questionIds)->delete();

        return redirect()->back()->with('success', 'Soal kuis berhasil disimpan');
    }
}
