<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LessonDocumentController extends Controller
{
    public function show(string $path): StreamedResponse
    {
        $path = $this->normalizePath($path);
        abort_unless(Storage::disk('public')->exists($path), 404);

        return response()->stream(function () use ($path) {
            echo Storage::disk('public')->get($path);
        }, 200, [
            'Content-Type' => $this->mimeType($path),
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
            'Cache-Control' => 'private, max-age=3600',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function download(string $path)
    {
        $path = $this->normalizePath($path);
        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->download($path);
    }

    private function normalizePath(string $path): string
    {
        return str_replace('\\', '/', urldecode($path));
    }

    private function mimeType(string $path): string
    {
        return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            default => Storage::disk('public')->mimeType($path) ?: 'application/octet-stream',
        };
    }
}
