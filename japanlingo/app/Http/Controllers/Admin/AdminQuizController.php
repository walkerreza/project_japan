<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Kanji;
use App\Http\Requests\Admin\QuizRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $quiz->load([
            'lesson:id,title',
            'questions' => fn($q) => $q
                ->withCount([
                    'attemptAnswers as attempts_count',
                    'attemptAnswers as correct_count' => fn ($query) => $query->where('is_correct', true),
                ])
                ->orderBy('order'),
        ]);

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
                'attempts_count' => (int) $q->attempts_count,
                'correct_count'  => (int) $q->correct_count,
                'correct_rate'   => $q->attempts_count > 0 ? round(($q->correct_count / $q->attempts_count) * 100, 1) : null,
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

    public function importQuestions(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'import_file' => ['required', 'file', 'max:2048'],
        ]);

        $file = $validated['import_file'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, ['csv', 'txt', 'xlsx'], true)) {
            return redirect()
                ->back()
                ->withErrors(['import_file' => 'Format import harus CSV atau XLSX.']);
        }

        $rows = $extension === 'xlsx'
            ? $this->parseXlsxRows($file->getRealPath())
            : $this->parseCsvRows($file->getRealPath());

        if (empty($rows)) {
            return redirect()->back()->withErrors(['import_file' => 'Tidak ada baris soal yang dapat diimport atau header tidak valid.']);
        }

        $nextOrder = (int) $quiz->questions()->max('order') + 1;
        $created = 0;

        DB::transaction(function () use ($rows, $quiz, $nextOrder, &$created) {
            foreach ($rows as $index => $row) {
                $questionText = trim((string) ($row['question_text'] ?? $row['question'] ?? $row['soal'] ?? ''));
                $correctAnswer = trim((string) ($row['correct_answer'] ?? $row['answer'] ?? $row['jawaban_benar'] ?? ''));

                if ($questionText === '' || $correctAnswer === '') {
                    continue;
                }

                $options = $this->parseCsvOptions($row);

                Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionText,
                    'correct_answer' => $correctAnswer,
                    'options' => $options,
                    'explanation' => $row['explanation'] ?? $row['pembahasan'] ?? null,
                    'audio_url' => $row['audio_url'] ?? null,
                    'order' => $nextOrder + $index,
                ]);

                $created++;
            }
        });

        if ($created === 0) {
            return redirect()->back()->withErrors(['import_file' => 'Tidak ada soal valid. Pastikan kolom question_text dan correct_answer terisi.']);
        }

        return redirect()->back()->with('success', "{$created} soal berhasil diimport.");
    }

    public function generateKanjiQuestions(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'jlpt_level' => ['required', 'string', 'max:8'],
            'count' => ['required', 'integer', 'min:1', 'max:50'],
            'mode' => ['required', 'in:meaning,reading,kanji_from_meaning'],
            'status' => ['nullable', 'in:draft,published,all'],
        ]);

        $status = $validated['status'] ?? 'published';
        $kanjiQuery = Kanji::query()
            ->where('jlpt_level', $validated['jlpt_level'])
            ->whereNotNull('meaning');

        if ($status !== 'all') {
            $kanjiQuery->where('status', $status);
        }

        $kanjiItems = $kanjiQuery
            ->inRandomOrder()
            ->take($validated['count'])
            ->get();

        if ($kanjiItems->isEmpty()) {
            return redirect()->back()->withErrors([
                'generate' => 'Tidak ada Kanji Bank yang cocok. Sync data dulu atau ubah filter status.',
            ]);
        }

        $distractorPool = Kanji::query()
            ->where('jlpt_level', $validated['jlpt_level'])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->get();

        $nextOrder = (int) $quiz->questions()->max('order') + 1;

        DB::transaction(function () use ($quiz, $kanjiItems, $distractorPool, $validated, $nextOrder) {
            foreach ($kanjiItems as $index => $kanji) {
                $question = $this->buildKanjiQuestion($kanji, $distractorPool, $validated['mode']);

                Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $question['question_text'],
                    'correct_answer' => $question['correct_answer'],
                    'options' => $question['options'],
                    'explanation' => $question['explanation'],
                    'order' => $nextOrder + $index,
                ]);
            }
        });

        return redirect()->back()->with('success', $kanjiItems->count() . ' soal berhasil dibuat dari Kanji Bank.');
    }

    private function buildKanjiQuestion(Kanji $kanji, $pool, string $mode): array
    {
        if ($mode === 'reading') {
            $correct = $this->firstReading($kanji);
            $options = $this->buildOptions(
                $correct,
                $pool->map(fn (Kanji $item) => $this->firstReading($item))->filter()->values()->all()
            );

            return [
                'question_text' => "Apa reading utama dari kanji {$kanji->kanji}?",
                'correct_answer' => $correct,
                'options' => $options,
                'explanation' => $this->kanjiExplanation($kanji),
            ];
        }

        if ($mode === 'kanji_from_meaning') {
            $correct = $kanji->kanji;
            $meaning = $kanji->indonesian_meaning ?: $kanji->meaning;
            $options = $this->buildOptions($correct, $pool->pluck('kanji')->filter()->values()->all());

            return [
                'question_text' => "Pilih kanji yang berarti: {$meaning}",
                'correct_answer' => $correct,
                'options' => $options,
                'explanation' => $this->kanjiExplanation($kanji),
            ];
        }

        $correct = $kanji->indonesian_meaning ?: $this->firstMeaning($kanji);
        $options = $this->buildOptions(
            $correct,
            $pool->map(fn (Kanji $item) => $item->indonesian_meaning ?: $this->firstMeaning($item))->filter()->values()->all()
        );

        return [
            'question_text' => "Apa arti dari kanji {$kanji->kanji}?",
            'correct_answer' => $correct,
            'options' => $options,
            'explanation' => $this->kanjiExplanation($kanji),
        ];
    }

    private function buildOptions(string $correct, array $pool): array
    {
        $options = collect($pool)
            ->filter(fn ($option) => trim((string) $option) !== '' && $option !== $correct)
            ->unique()
            ->shuffle()
            ->take(3)
            ->push($correct)
            ->shuffle()
            ->values()
            ->all();

        return count($options) >= 2 ? $options : [$correct];
    }

    private function firstReading(Kanji $kanji): string
    {
        $readings = collect(explode(',', (string) ($kanji->onyomi ?: $kanji->kunyomi)))
            ->map(fn ($value) => trim($value))
            ->filter();

        return $readings->first() ?: ($kanji->onyomi ?: $kanji->kunyomi ?: $kanji->kanji);
    }

    private function firstMeaning(Kanji $kanji): string
    {
        return trim(explode(',', (string) $kanji->meaning)[0]) ?: $kanji->kanji;
    }

    private function kanjiExplanation(Kanji $kanji): string
    {
        $meaning = $kanji->indonesian_meaning ?: $kanji->meaning ?: '-';
        $reading = trim(implode(' / ', array_filter([$kanji->onyomi, $kanji->kunyomi]))) ?: '-';

        return "Kanji {$kanji->kanji}: {$meaning}. Reading: {$reading}.";
    }

    private function parseCsvRows(string $path): array
    {
        $handle = fopen($path, 'r');

        if (! $handle) {
            return [];
        }

        $header = fgetcsv($handle);

        if (! $header) {
            fclose($handle);
            return [];
        }

        $headers = $this->normalizeImportHeaders($header);
        $rows = [];

        while (($row = fgetcsv($handle)) !== false) {
            if (count(array_filter($row, fn ($value) => trim((string) $value) !== '')) === 0) {
                continue;
            }

            $rows[] = array_combine($headers, array_slice(array_pad($row, count($headers), null), 0, count($headers)));
        }

        fclose($handle);

        return $rows;
    }

    private function parseXlsxRows(string $path): array
    {
        if (! class_exists(\ZipArchive::class)) {
            return [];
        }

        $zip = new \ZipArchive();

        if ($zip->open($path) !== true) {
            return [];
        }

        $sharedStrings = $this->readXlsxSharedStrings($zip);
        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();

        if (! $sheetXml) {
            return [];
        }

        $sheet = simplexml_load_string($sheetXml);

        if ($sheet === false || ! isset($sheet->sheetData->row)) {
            return [];
        }

        $rawRows = [];

        foreach ($sheet->sheetData->row as $row) {
            $values = [];

            foreach ($row->c as $cell) {
                $cellRef = (string) $cell['r'];
                $column = preg_replace('/\d+/', '', $cellRef);
                $index = $this->xlsxColumnIndex($column);
                $type = (string) $cell['t'];
                $value = (string) ($cell->v ?? '');

                if ($type === 's') {
                    $value = $sharedStrings[(int) $value] ?? '';
                } elseif ($type === 'inlineStr') {
                    $value = (string) ($cell->is->t ?? '');
                }

                $values[$index] = $value;
            }

            ksort($values);
            $maxIndex = empty($values) ? -1 : max(array_keys($values));
            $rawRows[] = $maxIndex >= 0
                ? array_map(fn ($index) => $values[$index] ?? '', range(0, $maxIndex))
                : [];
        }

        $header = array_shift($rawRows);

        if (! $header) {
            return [];
        }

        $headers = $this->normalizeImportHeaders($header);
        $rows = [];

        foreach ($rawRows as $row) {
            if (count(array_filter($row, fn ($value) => trim((string) $value) !== '')) === 0) {
                continue;
            }

            $rows[] = array_combine($headers, array_slice(array_pad($row, count($headers), null), 0, count($headers)));
        }

        return $rows;
    }

    private function readXlsxSharedStrings(\ZipArchive $zip): array
    {
        $xml = $zip->getFromName('xl/sharedStrings.xml');

        if (! $xml) {
            return [];
        }

        $shared = simplexml_load_string($xml);

        if ($shared === false || ! isset($shared->si)) {
            return [];
        }

        $strings = [];

        foreach ($shared->si as $item) {
            if (isset($item->t)) {
                $strings[] = (string) $item->t;
                continue;
            }

            $parts = [];
            foreach ($item->r as $run) {
                $parts[] = (string) $run->t;
            }
            $strings[] = implode('', $parts);
        }

        return $strings;
    }

    private function xlsxColumnIndex(string $column): int
    {
        $index = 0;
        foreach (str_split($column) as $char) {
            $index = ($index * 26) + (ord(strtoupper($char)) - 64);
        }

        return max(0, $index - 1);
    }

    private function normalizeImportHeaders(array $header): array
    {
        return array_map(fn ($value) => str($value)->lower()->replace(' ', '_')->toString(), $header);
    }

    private function parseCsvOptions(array $row): ?array
    {
        if (! empty($row['options'])) {
            $options = preg_split('/\s*\|\s*/', (string) $row['options']);
        } else {
            $options = [
                $row['option_a'] ?? $row['opsi_a'] ?? null,
                $row['option_b'] ?? $row['opsi_b'] ?? null,
                $row['option_c'] ?? $row['opsi_c'] ?? null,
                $row['option_d'] ?? $row['opsi_d'] ?? null,
            ];
        }

        $options = array_values(array_filter(array_map(
            fn ($option) => trim((string) $option),
            $options
        ), fn ($option) => $option !== ''));

        return count($options) > 0 ? $options : null;
    }
}
