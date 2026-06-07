<?php

namespace App\Services;

use App\Models\Kanji;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class QuizQuestionService
{
    public function syncQuestions(Quiz $quiz, array $validated): void
    {
        $questionIds = [];

        DB::transaction(function () use ($quiz, $validated, &$questionIds) {
            $quiz->update([
                'time_limit' => $validated['time_limit'] ?? null,
            ]);

            foreach ($validated['questions'] as $index => $data) {
                $normalized = $this->normalizePayload($data, $index);

                if ($normalized['error']) {
                    throw ValidationException::withMessages([
                        'questions' => $normalized['error'],
                    ]);
                }

                $question = $quiz->questions()->updateOrCreate(
                    ['id' => $data['id'] ?? null],
                    [
                        'type' => $normalized['type'],
                        'question_text' => $normalized['question_text'],
                        'correct_answer' => $normalized['correct_answer'],
                        'options' => $normalized['options'],
                        'explanation' => $normalized['explanation'],
                        'audio_url' => $normalized['audio_url'],
                        'order' => $index,
                    ]
                );

                $questionIds[] = $question->id;
            }

            $quiz->questions()->whereNotIn('id', $questionIds)->delete();
        });
    }

    public function importRows(Quiz $quiz, array $rows): int
    {
        $nextOrder = (int) $quiz->questions()->max('order') + 1;
        $created = 0;

        DB::transaction(function () use ($rows, $quiz, $nextOrder, &$created) {
            foreach ($rows as $index => $row) {
                $questionText = trim((string) ($row['question_text'] ?? $row['question'] ?? $row['soal'] ?? ''));
                $correctAnswer = trim((string) ($row['correct_answer'] ?? $row['answer'] ?? $row['jawaban_benar'] ?? ''));

                if ($questionText === '' || $correctAnswer === '') {
                    continue;
                }

                $normalized = $this->normalizePayload([
                    'type' => $row['type'] ?? $row['tipe'] ?? $quiz->type,
                    'question_text' => $questionText,
                    'correct_answer' => $correctAnswer,
                    'options' => $this->parseOptions($row),
                    'explanation' => $row['explanation'] ?? $row['pembahasan'] ?? null,
                    'audio_url' => $row['audio_url'] ?? null,
                ], $index);

                if ($normalized['error']) {
                    continue;
                }

                Question::create([
                    'quiz_id' => $quiz->id,
                    'type' => $normalized['type'],
                    'question_text' => $normalized['question_text'],
                    'correct_answer' => $normalized['correct_answer'],
                    'options' => $normalized['options'],
                    'explanation' => $normalized['explanation'],
                    'audio_url' => $normalized['audio_url'],
                    'order' => $nextOrder + $index,
                ]);

                $created++;
            }
        });

        return $created;
    }

    public function generateKanjiQuestions(Quiz $quiz, array $validated): int
    {
        $status = $validated['status'] ?? 'published';
        $kanjiItems = Kanji::query()
            ->where('jlpt_level', $validated['jlpt_level'])
            ->whereNotNull('meaning')
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->inRandomOrder()
            ->take($validated['count'])
            ->get();

        if ($kanjiItems->isEmpty()) {
            throw ValidationException::withMessages([
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

                if (count($question['options']) < 2) {
                    throw ValidationException::withMessages([
                        'generate' => 'Distraktor Kanji Bank belum cukup untuk membuat soal multiple choice yang valid.',
                    ]);
                }

                Question::create([
                    'quiz_id' => $quiz->id,
                    'type' => 'multiple_choice',
                    'question_text' => $question['question_text'],
                    'correct_answer' => $question['correct_answer'],
                    'options' => $question['options'],
                    'explanation' => $question['explanation'],
                    'order' => $nextOrder + $index,
                ]);
            }
        });

        return $kanjiItems->count();
    }

    public function templateRows(): array
    {
        return [
            ['multiple_choice', 'Apa arti dari kanji 火?', 'api', 'api|air|tanah|angin', '火 berarti api. Untuk multiple_choice, correct_answer harus sama persis dengan salah satu opsi.', ''],
            ['fill_blank', '彼は___に行きました。', '学校', 'がっこう', 'Gunakan ___ untuk bagian kosong. Kolom options dipakai sebagai hint opsional.', ''],
            ['listening', 'Ketik kata yang kamu dengar dari audio.', '天気予報', '', 'Untuk listening, audio_url wajib diisi.', 'https://example.com/audio.mp3'],
        ];
    }

    public function normalizeType(?string $type): string
    {
        $type = strtolower(trim((string) $type));

        return match ($type) {
            'fill_blank', 'fill-in-blank', 'fill in blank', 'typing' => 'fill_blank',
            'listening', 'listen' => 'listening',
            default => 'multiple_choice',
        };
    }

    public function normalizePayload(array $data, int $index): array
    {
        $type = $this->normalizeType($data['type'] ?? 'multiple_choice');
        $questionText = trim((string) ($data['question_text'] ?? ''));
        $correctAnswer = trim((string) ($data['correct_answer'] ?? ''));
        $audioUrl = trim((string) ($data['audio_url'] ?? ''));
        $options = array_values(array_unique(array_filter(array_map(
            fn ($option) => trim((string) $option),
            $data['options'] ?? []
        ), fn ($option) => $option !== '')));

        $number = $index + 1;
        $error = null;

        if ($type === 'multiple_choice') {
            if (count($options) < 2) {
                $error = "Soal {$number}: multiple choice wajib memiliki minimal 2 opsi.";
            } elseif (! in_array($correctAnswer, $options, true)) {
                $error = "Soal {$number}: jawaban benar wajib sama dengan salah satu opsi.";
            }
        }

        if ($type === 'listening' && $audioUrl === '') {
            $error = "Soal {$number}: listening wajib memiliki Audio URL.";
        }

        return [
            'error' => $error,
            'type' => $type,
            'question_text' => $questionText,
            'correct_answer' => $correctAnswer,
            'options' => $type === 'multiple_choice' ? $options : ($type === 'fill_blank' ? array_slice($options, 0, 1) : null),
            'explanation' => $data['explanation'] ?? null,
            'audio_url' => $audioUrl !== '' ? $audioUrl : null,
        ];
    }

    private function parseOptions(array $row): ?array
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

    private function buildKanjiQuestion(Kanji $kanji, Collection $pool, string $mode): array
    {
        if ($mode === 'reading') {
            $correct = $this->firstReading($kanji);
            $options = $this->buildOptions($correct, $pool->map(fn (Kanji $item) => $this->firstReading($item))->filter()->values()->all());

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

            return [
                'question_text' => "Pilih kanji yang berarti: {$meaning}",
                'correct_answer' => $correct,
                'options' => $this->buildOptions($correct, $pool->pluck('kanji')->filter()->values()->all()),
                'explanation' => $this->kanjiExplanation($kanji),
            ];
        }

        $correct = $kanji->indonesian_meaning ?: $this->firstMeaning($kanji);

        return [
            'question_text' => "Apa arti dari kanji {$kanji->kanji}?",
            'correct_answer' => $correct,
            'options' => $this->buildOptions($correct, $pool->map(fn (Kanji $item) => $item->indonesian_meaning ?: $this->firstMeaning($item))->filter()->values()->all()),
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

        return count($options) >= 2 ? $options : [];
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
}
