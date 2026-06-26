<?php

namespace App\Services;

use App\Models\PresentationDeck;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PresentationImportService
{
    public function importPptx(PresentationDeck $deck, UploadedFile $file): int
    {
        $this->ensureBinaryAvailable('soffice', 'LibreOffice');
        $this->ensureBinaryAvailable('pdftoppm', 'Poppler');

        $importId = now()->format('YmdHis') . '-' . Str::random(8);
        $tempDir = storage_path("app/tmp/presentation-imports/{$importId}");
        File::ensureDirectoryExists($tempDir);

        try {
            $pptxPath = $file->storeAs("presentations/imports/{$deck->id}", "{$importId}.pptx", 'public');
            $localPptxPath = Storage::disk('public')->path($pptxPath);

            $this->runProcess([
                'soffice',
                '--headless',
                '--convert-to',
                'pdf',
                '--outdir',
                $tempDir,
                $localPptxPath,
            ], 'Gagal mengubah PPTX menjadi PDF.');

            $pdfPath = collect(File::files($tempDir))
                ->first(fn ($item) => strtolower($item->getExtension()) === 'pdf')
                ?->getPathname();

            if (! $pdfPath) {
                throw ValidationException::withMessages([
                    'pptx_file' => 'PPTX berhasil diproses, tetapi file PDF hasil konversi tidak ditemukan.',
                ]);
            }

            $imagePrefix = "{$tempDir}/slide";
            $this->runProcess([
                'pdftoppm',
                '-png',
                '-r',
                '144',
                $pdfPath,
                $imagePrefix,
            ], 'Gagal mengubah PDF presentasi menjadi gambar slide.');

            $images = collect(File::files($tempDir))
                ->filter(fn ($item) => strtolower($item->getExtension()) === 'png')
                ->sortBy(fn ($item) => $item->getFilename())
                ->values();

            if ($images->isEmpty()) {
                throw ValidationException::withMessages([
                    'pptx_file' => 'Tidak ada gambar slide yang berhasil dibuat dari PPTX.',
                ]);
            }

            $nextOrder = (int) $deck->slides()->max('order') + 1;

            foreach ($images as $index => $image) {
                $publicPath = "presentations/slides/{$deck->id}/{$importId}-" . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT) . '.png';
                Storage::disk('public')->put($publicPath, File::get($image->getPathname()));

                $deck->slides()->create([
                    'title' => 'Import PPTX Slide ' . ($index + 1),
                    'layout' => 'media',
                    'content' => null,
                    'media_url' => Storage::url($publicPath),
                    'background' => 'light',
                    'accent_color' => '#E64A19',
                    'speaker_notes' => null,
                    'order' => $nextOrder + $index,
                ]);
            }

            return $images->count();
        } finally {
            File::deleteDirectory($tempDir);
        }
    }

    private function ensureBinaryAvailable(string $binary, string $label): void
    {
        $exitCode = $this->runCommand([$binary, '--version'], false);

        if ($exitCode !== 0) {
            throw ValidationException::withMessages([
                'pptx_file' => "{$label} converter belum tersedia di server.",
            ]);
        }
    }

    private function runProcess(array $command, string $message): void
    {
        $exitCode = $this->runCommand($command);

        if ($exitCode !== 0) {
            throw ValidationException::withMessages([
                'pptx_file' => $message,
            ]);
        }
    }

    private function runCommand(array $command, bool $captureOutput = true): int
    {
        $escaped = implode(' ', array_map('escapeshellarg', $command));
        $output = [];
        $exitCode = 1;

        exec($escaped . ($captureOutput ? ' 2>&1' : ''), $output, $exitCode);

        return $exitCode;
    }
}
