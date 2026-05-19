<?php

namespace App\Console\Commands;

use App\Models\Kanji;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SyncKanjiBank extends Command
{
    protected $signature = 'kanji:sync
        {--level=N3 : JLPT level to sync, for example N3 or all}
        {--limit=0 : Maximum kanji detail requests, useful for testing}
        {--sleep=100 : Delay between detail requests in milliseconds}';

    protected $description = 'Sync kanji_bank from kanjiapi.dev and store the result locally.';

    public function handle(): int
    {
        $level = strtoupper((string) $this->option('level'));
        $targetJlpt = $level === 'ALL' ? null : (int) str_replace('N', '', $level);
        $limit = max(0, (int) $this->option('limit'));
        $sleepMs = max(0, (int) $this->option('sleep'));

        if ($targetJlpt !== null && ($targetJlpt < 1 || $targetJlpt > 5)) {
            $this->error('Invalid --level. Use N1, N2, N3, N4, N5, or all.');
            return self::FAILURE;
        }

        $this->info('Fetching kanji list from kanjiapi.dev...');

        $listEndpoint = $targetJlpt === null
            ? 'https://kanjiapi.dev/v1/kanji/all'
            : 'https://kanjiapi.dev/v1/kanji/jlpt-' . $targetJlpt;

        $listResponse = Http::timeout(20)->retry(2, 500)->get($listEndpoint);

        if (! $listResponse->successful() || ! is_array($listResponse->json())) {
            $this->error('Failed to fetch kanji list from kanjiapi.dev.');
            return self::FAILURE;
        }

        $kanjiList = $listResponse->json();

        if ($limit > 0) {
            $kanjiList = array_slice($kanjiList, 0, $limit);
        }

        $bar = $this->output->createProgressBar(count($kanjiList));
        $bar->start();

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($kanjiList as $character) {
            $bar->advance();

            $detail = $this->fetchKanjiDetail((string) $character);

            if ($detail === null) {
                $failed++;
                $this->sleep($sleepMs);
                continue;
            }

            $jlpt = $detail['jlpt'] ?? null;

            if ($targetJlpt !== null && (int) $jlpt !== $targetJlpt) {
                $skipped++;
                $this->sleep($sleepMs);
                continue;
            }

            $model = Kanji::updateOrCreate(
                ['kanji' => $detail['kanji'] ?? $character],
                [
                    'onyomi' => implode(', ', $detail['on_readings'] ?? []),
                    'kunyomi' => implode(', ', $detail['kun_readings'] ?? []),
                    'meaning' => implode(', ', $detail['meanings'] ?? []),
                    'jlpt_level' => $jlpt ? 'N' . $jlpt : $level,
                    'stroke_count' => $detail['stroke_count'] ?? null,
                    'tags' => array_values(array_filter([
                        $jlpt ? 'JLPT N' . $jlpt : null,
                        isset($detail['grade']) ? 'Grade ' . $detail['grade'] : null,
                    ])),
                    'status' => 'draft',
                ]
            );

            $model->wasRecentlyCreated ? $created++ : $updated++;
            $this->sleep($sleepMs);
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Kanji sync finished. Created: {$created}, updated: {$updated}, skipped: {$skipped}, failed: {$failed}.");

        return self::SUCCESS;
    }

    private function fetchKanjiDetail(string $character): ?array
    {
        try {
            $response = Http::timeout(10)
                ->retry(2, 300)
                ->get('https://kanjiapi.dev/v1/kanji/' . urlencode($character));

            return $response->successful() && is_array($response->json())
                ? $response->json()
                : null;
        } catch (\Throwable) {
            return null;
        }
    }

    private function sleep(int $milliseconds): void
    {
        if ($milliseconds > 0) {
            usleep($milliseconds * 1000);
        }
    }
}
