<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use SimpleXMLElement;
use ZipArchive;

class LessonDocumentService
{
    public function upload(UploadedFile $file): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $path = $file->store('lessons', 'public');
        $contentHtml = match ($extension) {
            'docx' => $this->extractDocxHtml($file->getRealPath()),
            'pptx' => $this->extractPptxHtml($file->getRealPath()),
            default => null,
        };

        return [
            'path' => $path,
            'url' => url('/lesson-documents/' . $path),
            'download_url' => url('/lesson-documents-download/' . $path),
            'name' => $file->getClientOriginalName(),
            'extension' => $extension,
            'document_kind' => $this->kind($extension),
            'content_html' => $contentHtml,
            'message' => $contentHtml
                ? 'File berhasil diupload dan kontennya diimport.'
                : 'File berhasil diupload.',
        ];
    }

    public function delete(?string $path): void
    {
        if (! $path) {
            return;
        }

        $path = str_replace('\\', '/', $path);
        $path = preg_replace('#^/storage/#', '', $path);

        if (! str_starts_with($path, 'lessons/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    public function kind(string $extension): string
    {
        return match ($extension) {
            'pdf' => 'pdf',
            'doc', 'docx' => 'word',
            'ppt', 'pptx' => 'powerpoint',
            default => 'attachment',
        };
    }

    private function extractDocxHtml(string $path): ?string
    {
        if (! class_exists(ZipArchive::class)) {
            return null;
        }

        $zip = new ZipArchive();

        if ($zip->open($path) !== true) {
            return null;
        }

        $documentXml = $zip->getFromName('word/document.xml');
        $zip->close();

        if (! $documentXml) {
            return null;
        }

        $xml = simplexml_load_string($documentXml);

        if ($xml === false) {
            return null;
        }

        $xml->registerXPathNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        $paragraphs = [];

        foreach ($xml->xpath('//w:p') ?: [] as $paragraph) {
            $text = $this->extractWordParagraphText($paragraph);

            if ($text === '') {
                continue;
            }

            $styleId = (string) (($paragraph->xpath('.//w:pStyle/@w:val') ?: [null])[0] ?? '');
            $tag = preg_match('/heading|title|judul/i', $styleId) === 1 ? 'h2' : 'p';
            $paragraphs[] = "<{$tag}>" . e($text) . "</{$tag}>";
        }

        return count($paragraphs) > 0 ? implode("\n", $paragraphs) : null;
    }

    private function extractWordParagraphText(SimpleXMLElement $paragraph): string
    {
        $parts = [];

        foreach ($paragraph->xpath('.//w:t|.//w:tab|.//w:br') ?: [] as $node) {
            $name = $node->getName();

            if ($name === 'tab') {
                $parts[] = ' ';
                continue;
            }

            if ($name === 'br') {
                $parts[] = "\n";
                continue;
            }

            $parts[] = (string) $node;
        }

        return trim(preg_replace('/[ \t]+/', ' ', implode('', $parts)));
    }

    private function extractPptxHtml(string $path): ?string
    {
        if (! class_exists(ZipArchive::class)) {
            return null;
        }

        $zip = new ZipArchive();

        if ($zip->open($path) !== true) {
            return null;
        }

        $slideNames = [];

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);

            if (preg_match('#^ppt/slides/slide(\d+)\.xml$#', $name, $matches)) {
                $slideNames[(int) $matches[1]] = $name;
            }
        }

        ksort($slideNames);
        $slides = [];

        foreach ($slideNames as $number => $slideName) {
            $slideXml = $zip->getFromName($slideName);

            if (! $slideXml) {
                continue;
            }

            $xml = simplexml_load_string($slideXml);

            if ($xml === false) {
                continue;
            }

            $xml->registerXPathNamespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main');
            $texts = array_values(array_filter(array_map(
                fn ($node) => trim((string) $node),
                $xml->xpath('//a:t') ?: []
            )));

            if (count($texts) === 0) {
                continue;
            }

            $title = array_shift($texts);
            $body = implode('</li><li>', array_map(fn ($text) => e($text), $texts));
            $slides[] = '<section class="jl-ppt-slide"><h2>Slide ' . $number . ': ' . e($title) . '</h2>' .
                ($body !== '' ? '<ul><li>' . $body . '</li></ul>' : '') .
                '</section>';
        }

        $zip->close();

        return count($slides) > 0 ? implode("\n", $slides) : null;
    }
}
