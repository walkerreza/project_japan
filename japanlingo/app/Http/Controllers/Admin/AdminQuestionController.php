<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Quiz;
use App\Http\Requests\Admin\QuestionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminQuestionController extends Controller
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

        return Inertia::render('Admin/Questions/AdminQuestionsIndex', [
            'questions'     => $questions,
            'quizzes'       => $quizzes,
            'selectedQuizId' => $request->quiz_id,
        ]);
    }

    public function create(Request $request)
    {
        $quizzes = Quiz::with('lesson:id,title')->get();
        return Inertia::render('Admin/Questions/AdminQuestionsCreate', [
            'quizzes'       => $quizzes,
            'defaultQuizId' => $request->quiz_id,
        ]);
    }

    public function store(QuestionRequest $request)
    {
        $validated = $request->validated();

        Question::create($validated);

        return redirect()->back()->with('success', 'Pertanyaan berhasil dibuat');
    }

    public function edit(Question $question)
    {
        $quizzes = Quiz::with('lesson:id,title')->get();
        return Inertia::render('Admin/Questions/AdminQuestionsEdit', [
            'question' => $question,
            'quizzes'  => $quizzes,
        ]);
    }

    public function update(QuestionRequest $request, Question $question)
    {
        $validated = $request->validated();

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
