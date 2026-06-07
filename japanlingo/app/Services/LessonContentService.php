<?php

namespace App\Services;

use App\Models\Kanji;
use App\Models\Module;
use Illuminate\Support\Facades\DB;

class LessonContentService
{
    public function importRows(Module $module, array $rows): int
    {
        $nextOrder = (int) $module->lessons()->max('order') + 1;
        $created = 0;

        DB::transaction(function () use ($module, $rows, $nextOrder, &$created) {
            foreach ($rows as $index => $row) {
                $title = trim((string) ($row['lesson_title'] ?? $row['title'] ?? $row['judul'] ?? ''));

                if ($title === '') {
                    continue;
                }

                $status = in_array(($row['status'] ?? ''), ['draft', 'published'], true)
                    ? $row['status']
                    : 'draft';

                $module->lessons()->create([
                    'title' => $title,
                    'content' => $this->normalizeContent((string) ($row['content'] ?? $row['materi'] ?? '')),
                    'type' => $this->normalizeType($row['lesson_type'] ?? $row['type'] ?? 'text'),
                    'video_url' => $row['video_url'] ?? null,
                    'file_url' => $row['file_url'] ?? null,
                    'duration_minutes' => max(1, (int) ($row['duration_minutes'] ?? $row['duration'] ?? 5)),
                    'status' => $status,
                    'order' => is_numeric($row['order'] ?? null) ? (int) $row['order'] : $nextOrder + $index,
                ]);

                $created++;
            }
        });

        return $created;
    }

    public function createKanjiLessons(Module $module, array $validated): int
    {
        $status = $validated['status'] ?? 'published';
        $kanjiItems = Kanji::query()
            ->where('jlpt_level', $validated['jlpt_level'])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->orderBy('kanji')
            ->take($validated['count'])
            ->get();

        if ($kanjiItems->isEmpty()) {
            return 0;
        }

        $nextOrder = (int) $module->lessons()->max('order') + 1;

        DB::transaction(function () use ($module, $kanjiItems, $nextOrder) {
            foreach ($kanjiItems as $index => $kanji) {
                $module->lessons()->create([
                    'title' => "Kanji {$kanji->jlpt_level} - {$kanji->kanji}",
                    'content' => $this->kanjiLessonHtml($kanji),
                    'type' => 'text',
                    'order' => $nextOrder + $index,
                    'duration_minutes' => 5,
                    'status' => 'draft',
                ]);
            }
        });

        return $kanjiItems->count();
    }

    public function templateRows(): array
    {
        return [
            ['Grammar N3 - Pola ~ように', 'text', '<h2>Tujuan Belajar</h2><p>Memahami penggunaan pola ~ように.</p><h2>Penjelasan</h2><p>Tulis materi utama di sini.</p><h2>Contoh</h2><p>日本語が上手になるように、毎日勉強します。</p>', '', '', '10', 'draft', '1'],
            ['Kanji N3 - 進', 'text', '<h2>Kanji</h2><p style="font-size:48px;font-weight:900;">進</p><p><strong>Arti:</strong> maju</p><p><strong>Contoh:</strong> 進学</p>', '', '', '8', 'draft', '2'],
            ['Listening N3 - Percakapan Pendek', 'video_yt', '<h2>Instruksi</h2><p>Dengarkan audio/video, lalu catat kosakata baru.</p>', 'https://youtube.com/watch?v=example', '', '12', 'draft', '3'],
        ];
    }

    public function normalizeContent(string $content): string
    {
        $content = trim($content);

        if ($content === '') {
            return '<p>Materi belum diisi. Lengkapi konten ini sebelum publish.</p>';
        }

        if (preg_match('/<\/?[a-z][\s\S]*>/i', $content)) {
            return $content;
        }

        return collect(preg_split("/\r\n|\n|\r/", $content))
            ->map(fn ($line) => trim($line))
            ->filter()
            ->map(fn ($line) => '<p>' . e($line) . '</p>')
            ->implode("\n");
    }

    public function normalizeType(?string $type): string
    {
        $type = strtolower(trim((string) $type));

        return match ($type) {
            'video', 'youtube', 'video_yt' => 'video_yt',
            'file', 'pdf', 'doc', 'ppt', 'attachment' => 'file',
            default => 'text',
        };
    }

    private function kanjiLessonHtml(Kanji $kanji): string
    {
        $meaning = e($kanji->indonesian_meaning ?: $kanji->meaning ?: '-');
        $onyomi = e($kanji->onyomi ?: '-');
        $kunyomi = e($kanji->kunyomi ?: '-');
        $exampleWord = e($kanji->example_word ?: '-');
        $exampleReading = e($kanji->example_reading ?: '-');
        $exampleMeaning = e($kanji->example_meaning ?: '-');
        $exampleSentence = e($kanji->example_sentence ?: '-');
        $exampleSentenceReading = e($kanji->example_sentence_reading ?: '-');
        $exampleSentenceMeaning = e($kanji->example_sentence_meaning ?: '-');

        return <<<HTML
<h2 style="font-size: 48px; line-height: 1; margin-bottom: 16px;">{$kanji->kanji}</h2>
<p><strong>JLPT:</strong> {$kanji->jlpt_level}</p>
<p><strong>Arti:</strong> {$meaning}</p>
<p><strong>Onyomi:</strong> {$onyomi}</p>
<p><strong>Kunyomi:</strong> {$kunyomi}</p>
<hr>
<p><strong>Contoh kata:</strong> {$exampleWord}</p>
<p><strong>Reading:</strong> {$exampleReading}</p>
<p><strong>Arti contoh:</strong> {$exampleMeaning}</p>
<p><strong>Contoh kalimat:</strong> {$exampleSentence}</p>
<p><strong>Reading kalimat:</strong> {$exampleSentenceReading}</p>
<p><strong>Arti kalimat:</strong> {$exampleSentenceMeaning}</p>
HTML;
    }
}
