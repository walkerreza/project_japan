<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Question::with('quiz.lesson')->orderBy('order');

        if ($request->filled('quiz_id')) {
            $query->where('quiz_id', $request->quiz_id);
        }

        $questions = $query->get()->map(fn($q) => [
            'id'            => $q->id,
            'question_text' => $q->question_text,
            'correct_answer' => $q->correct_answer,
            'options'       => $q->options,
            'audio_url'     => $q->audio_url,
            'order'         => $q->order,
            'quiz'          => $q->quiz ? ['id' => $q->quiz->id, 'type' => $q->quiz->type] : null,
        ]);

        $quizzes = Quiz::with('lesson:id,title')->get(['id', 'lesson_id', 'type']);

        return Inertia::render('Admin/Questions/Index', [
            'questions'     => $questions,
            'quizzes'       => $quizzes,
            'selectedQuizId' => $request->quiz_id,
        ]);
    }

    public function create(Request $request)
    {
        $quizzes = Quiz::with('lesson:id,title')->get();
        return Inertia::render('Admin/Questions/Create', [
            'quizzes'       => $quizzes,
            'defaultQuizId' => $request->quiz_id,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'quiz_id'        => 'required|exists:quizzes,id',
            'question_text'  => 'required|string',
            'correct_answer' => 'required|string',
            'explanation'    => 'nullable|string',
            'order'          => 'required|integer|min:0',
        ];

        // Field kondisional berdasarkan tipe quiz
        $quiz = Quiz::find($request->quiz_id);
        if ($quiz && $quiz->type === 'multiple_choice') {
            $rules['options'] = 'required|array|min:2';
            $rules['options.*'] = 'required|string';
        }
        if ($quiz && $quiz->type === 'listening') {
            $rules['audio_url'] = 'nullable|string|url';
        }

        $validated = $request->validate($rules, [
            'quiz_id.required'        => 'Kuis wajib dipilih',
            'quiz_id.exists'          => 'Kuis tidak ditemukan',
            'question_text.required'  => 'Teks pertanyaan wajib diisi',
            'correct_answer.required' => 'Jawaban benar wajib diisi',
            'options.required'        => 'Pilihan jawaban wajib diisi untuk soal pilihan ganda',
            'options.min'             => 'Minimal 2 pilihan jawaban diperlukan',
        ]);

        Question::create($validated);

        return redirect()->back()->with('success', 'Pertanyaan berhasil dibuat');
    }

    public function edit(Question $question)
    {
        $quizzes = Quiz::with('lesson:id,title')->get();
        return Inertia::render('Admin/Questions/Edit', [
            'question' => $question,
            'quizzes'  => $quizzes,
        ]);
    }

    public function update(Request $request, Question $question)
    {
        $rules = [
            'quiz_id'        => 'required|exists:quizzes,id',
            'question_text'  => 'required|string',
            'correct_answer' => 'required|string',
            'explanation'    => 'nullable|string',
            'order'          => 'required|integer|min:0',
        ];

        $quiz = Quiz::find($request->quiz_id);
        if ($quiz && $quiz->type === 'multiple_choice') {
            $rules['options'] = 'required|array|min:2';
        }
        if ($quiz && $quiz->type === 'listening') {
            $rules['audio_url'] = 'nullable|string|url';
        }

        $validated = $request->validate($rules, [
            'quiz_id.required'        => 'Kuis wajib dipilih',
            'question_text.required'  => 'Teks pertanyaan wajib diisi',
            'correct_answer.required' => 'Jawaban benar wajib diisi',
        ]);

        $question->update($validated);

        return redirect()->back()->with('success', 'Pertanyaan berhasil diperbarui');
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return redirect()->back()->with('success', 'Pertanyaan berhasil dihapus');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|exists:questions,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            Question::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Urutan berhasil diperbarui']);
    }
}
