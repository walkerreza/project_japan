<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\QuizRequest;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Services\ExcelTemplateService;
use App\Services\QuizQuestionService;
use App\Services\SpreadsheetImportService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminQuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::with(['lesson:id,title'])->withCount('questions');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($query) use ($search) {
                $query->whereHas('lesson', fn ($q) => $q->where('title', 'ilike', '%' . $search . '%'))
                    ->orWhere('type', 'ilike', '%' . $search . '%');
            });
        }

        if ($request->filled('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        $quizzes = $query->paginate(10)->through(fn ($quiz) => [
            'id' => $quiz->id,
            'type' => $quiz->type,
            'time_limit' => $quiz->time_limit,
            'status' => $quiz->status ?? 'published',
            'question_count' => $quiz->questions_count,
            'lesson' => $quiz->lesson,
        ]);

        return Inertia::render('Admin/Kuis/ManajemenKuis', [
            'quizzes' => $quizzes,
            'lessons' => Lesson::orderBy('order')->get(['id', 'title']),
            'filters' => $request->only('search', 'lesson_id'),
        ]);
    }

    public function store(QuizRequest $request)
    {
        Quiz::create($request->validated());

        return redirect()->back()->with('success', 'Kuis berhasil dibuat');
    }

    public function updateStatus(Request $request, Quiz $quiz)
    {
        $quiz->update($request->validate([
            'status' => ['required', 'in:draft,published'],
        ]));

        return redirect()->back()->with('success', 'Status kuis berhasil diperbarui');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();

        return redirect()->back()->with('success', 'Kuis berhasil dihapus');
    }

    public function builder(Quiz $quiz)
    {
        $quiz->load([
            'lesson:id,title',
            'questions' => fn ($query) => $query
                ->withCount([
                    'attemptAnswers as attempts_count',
                    'attemptAnswers as correct_count' => fn ($answerQuery) => $answerQuery->where('is_correct', true),
                ])
                ->orderBy('order'),
        ]);

        return Inertia::render('Admin/Kuis/BuilderKuis', [
            'quiz' => [
                'id' => $quiz->id,
                'type' => $quiz->type,
                'time_limit' => $quiz->time_limit,
                'status' => $quiz->status ?? 'published',
                'lesson' => $quiz->lesson,
            ],
            'questions' => $quiz->questions->map(fn ($question) => [
                'id' => $question->id,
                'type' => $question->type ?: ($quiz->type ?: 'multiple_choice'),
                'question_text' => $question->question_text,
                'correct_answer' => $question->correct_answer,
                'options' => $question->options ?? [],
                'explanation' => $question->explanation,
                'audio_url' => $question->audio_url,
                'order' => $question->order,
                'attempts_count' => (int) $question->attempts_count,
                'correct_count' => (int) $question->correct_count,
                'correct_rate' => $question->attempts_count > 0
                    ? round(($question->correct_count / $question->attempts_count) * 100, 1)
                    : null,
            ]),
        ]);
    }

    public function updateQuestions(Request $request, Quiz $quiz, QuizQuestionService $questions)
    {
        $validated = $request->validate([
            'time_limit' => ['nullable', 'integer', 'min:0', 'max:1440'],
            'questions' => 'required|array',
            'questions.*.id' => 'nullable|integer',
            'questions.*.type' => ['required', Rule::in(['multiple_choice', 'fill_blank', 'listening'])],
            'questions.*.question_text' => 'required|string|max:5000',
            'questions.*.correct_answer' => 'required|string|max:1000',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*' => 'nullable|string|max:1000',
            'questions.*.explanation' => 'nullable|string|max:5000',
            'questions.*.audio_url' => 'nullable|string|max:2048',
        ]);

        $questions->syncQuestions($quiz, $validated);

        return redirect()->back()->with('success', 'Soal kuis berhasil disimpan');
    }

    public function importQuestions(
        Request $request,
        Quiz $quiz,
        SpreadsheetImportService $spreadsheets,
        QuizQuestionService $questions
    ) {
        $validated = $request->validate([
            'import_file' => ['required', 'file', 'max:2048'],
        ]);

        $file = $validated['import_file'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, ['csv', 'txt', 'xlsx'], true)) {
            return redirect()->back()->withErrors(['import_file' => 'Format import harus CSV atau XLSX.']);
        }

        $rows = $spreadsheets->rows($file->getRealPath(), $extension);

        if (empty($rows)) {
            return redirect()->back()->withErrors(['import_file' => 'Tidak ada baris soal yang dapat diimport atau header tidak valid.']);
        }

        $created = $questions->importRows($quiz, $rows);

        if ($created === 0) {
            return redirect()->back()->withErrors(['import_file' => 'Tidak ada soal valid. Pastikan kolom question_text dan correct_answer terisi.']);
        }

        return redirect()->back()->with('success', "{$created} soal berhasil diimport.");
    }

    public function downloadImportTemplate(
        Quiz $quiz,
        string $format,
        ExcelTemplateService $templates,
        QuizQuestionService $questions
    ) {
        $format = strtolower($format);

        if (! in_array($format, ['csv', 'xlsx'], true)) {
            abort(404);
        }

        $headers = ['type', 'question_text', 'correct_answer', 'options', 'explanation', 'audio_url'];
        $rows = $questions->templateRows();
        $filename = 'japanlingo-quiz-import-template-v1.' . $format;

        if ($format === 'csv') {
            return $templates->csvResponse($headers, $rows, $filename);
        }

        $path = $templates->xlsxPath($headers, $rows, 'Quiz Import', 'japanlingo_quiz_template_');

        return response()
            ->download($path, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend(true);
    }

    public function generateKanjiQuestions(Request $request, Quiz $quiz, QuizQuestionService $questions)
    {
        $validated = $request->validate([
            'jlpt_level' => ['required', 'string', 'max:8'],
            'count' => ['required', 'integer', 'min:1', 'max:50'],
            'mode' => ['required', 'in:meaning,reading,kanji_from_meaning'],
            'status' => ['nullable', 'in:draft,published,all'],
        ]);

        $created = $questions->generateKanjiQuestions($quiz, $validated);

        return redirect()->back()->with('success', $created . ' soal berhasil dibuat dari Kanji Bank.');
    }
}
