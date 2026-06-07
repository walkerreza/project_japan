<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\ActivityLog;
use App\Models\Lesson;
use App\Models\Module as LearningModule;
use App\Models\News;
use App\Models\NewsAttachment;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SuperAdminContentController extends SuperAdminBaseController
{
    public function __invoke(Request $request)
    {
        $filters = [
            'search' => (string) $request->string('search'),
            'status' => $request->string('status')->value() ?: 'all',
            'audience' => $request->string('audience')->value() ?: 'all',
            'pinned' => $request->string('pinned')->value() ?: 'all',
        ];

        $news = News::with(['creator:id,username', 'attachments'])
            ->when($filters['search'], fn ($query, $search) => $query->where('title', 'like', "%{$search}%"))
            ->when($filters['status'] !== 'all', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['audience'] !== 'all', fn ($query) => $query->where('audience', $filters['audience']))
            ->when($filters['pinned'] !== 'all', fn ($query) => $query->where('is_pinned', $filters['pinned'] === 'yes'))
            ->latest()
            ->paginate(8)
            ->withQueryString()
            ->through(fn (News $item) => $this->mapNews($item));

        return Inertia::render('SuperAdmin/Konten/Konten', [
            'stats' => [
                $this->stat('Module Aktif', number_format(LearningModule::count()), 'M'),
                $this->stat('Lesson Publish', number_format(Lesson::count()), 'L'),
                $this->stat('Quiz Siap Pakai', number_format(Quiz::count()), 'Q'),
                $this->stat('News Aktif', number_format(News::where('status', 'published')->count()), 'N'),
            ],
            'news' => $news,
            'filters' => $filters,
            'updates' => ActivityLog::with('actor:id,username')
                ->whereIn('target_type', ['module', 'lesson', 'quiz', 'news'])
                ->latest()
                ->take(4)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'id' => $log->id,
                    'item' => $log->target_type ? ucfirst($log->target_type) . ' #' . $log->target_id : $log->action,
                    'by' => $log->actor?->username ?? 'System',
                    'state' => 'Updated',
                    'created_at' => optional($log->created_at)->toIso8601String(),
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateNews($request);

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $news = News::create([
            ...$validated,
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        $this->logActivity($request, 'news.created', 'news', $news->id, "Membuat news {$news->title}");

        return redirect()->back()->with('success', 'News berhasil dibuat');
    }

    public function update(Request $request, News $news)
    {
        $validated = $this->validateNews($request);

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = $news->published_at ?? now();
        }

        $news->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);

        $this->logActivity($request, 'news.updated', 'news', $news->id, "Memperbarui news {$news->title}");

        return redirect()->back()->with('success', 'News berhasil diperbarui');
    }

    public function destroy(Request $request, News $news)
    {
        foreach ($news->attachments as $attachment) {
            if ($attachment->file_path) {
                Storage::disk('public')->delete($attachment->file_path);
            }
        }

        $title = $news->title;
        $id = $news->id;
        $news->delete();

        $this->logActivity($request, 'news.deleted', 'news', $id, "Menghapus news {$title}");

        return redirect()->back()->with('success', 'News berhasil dihapus');
    }

    public function storeAttachment(Request $request, News $news)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:image,document,video_embed'],
            'file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf,doc,docx', 'max:8192'],
            'video_embed_url' => ['nullable', 'url', 'max:500'],
        ]);

        if ($validated['type'] === 'video_embed') {
            abort_unless(! empty($validated['video_embed_url']), 422, 'URL video wajib diisi.');

            $attachment = $news->attachments()->create([
                'file_name' => 'Video Embed',
                'file_type' => 'video_embed',
                'video_embed_url' => $validated['video_embed_url'],
                'sort_order' => ($news->attachments()->max('sort_order') ?? -1) + 1,
            ]);

            $this->logActivity($request, 'news.attachment_added', 'news', $news->id, "Menambah video embed ke news {$news->title}");

            return redirect()->back()->with('success', 'Video embed berhasil ditambahkan');
        }

        abort_unless($request->hasFile('file'), 422, 'File wajib diunggah.');

        $file = $request->file('file');
        $folder = $validated['type'] === 'image' ? 'images' : 'documents';
        $path = $file->store("uploads/news/{$folder}", 'public');

        $attachment = $news->attachments()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $validated['type'],
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'sort_order' => ($news->attachments()->max('sort_order') ?? -1) + 1,
        ]);

        $this->logActivity($request, 'news.attachment_added', 'news', $news->id, "Menambah attachment {$attachment->file_name} ke news {$news->title}");

        return redirect()->back()->with('success', 'Attachment berhasil ditambahkan');
    }

    public function storeEditorImage(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $path = $validated['image']->store('uploads/news/editor', 'public');

        return response()->json([
            'url' => asset("storage/{$path}"),
        ]);
    }

    public function destroyAttachment(Request $request, News $news, NewsAttachment $attachment)
    {
        abort_unless($attachment->news_id === $news->id, 404);

        if ($attachment->file_path) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $fileName = $attachment->file_name;
        $attachment->delete();

        $this->logActivity($request, 'news.attachment_deleted', 'news', $news->id, "Menghapus attachment {$fileName} dari news {$news->title}");

        return redirect()->back()->with('success', 'Attachment berhasil dihapus');
    }

    private function validateNews(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,pending,published,archived'],
            'audience' => ['required', 'in:students,admins,all'],
            'is_pinned' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $validated['body'] = $this->sanitizeNewsBody($validated['body'] ?? '');

        return $validated;
    }

    private function sanitizeNewsBody(?string $body): string
    {
        $body = $body ?? '';
        $body = preg_replace('/<(script|style|iframe|object|embed|form|input|button|textarea|select|option)[^>]*>.*?<\/\1>/is', '', $body);
        $body = preg_replace('/<img[^>]+src=["\']data:image\/[^"\']+["\'][^>]*>/i', '', $body);
        $body = preg_replace('/\s+on[a-z]+\s*=\s*(".*?"|\'.*?\'|[^\s>]+)/is', '', $body);
        $body = preg_replace('/(href|src)\s*=\s*([\'"])\s*javascript:.*?\2/is', '$1="#"', $body);
        $body = preg_replace('/style\s*=\s*(".*?"|\'.*?\'|[^\s>]+)/is', '', $body);

        return strip_tags($body, '<p><br><strong><b><em><i><u><s><ol><ul><li><blockquote><pre><code><a><img><h1><h2><h3><span>');
    }

    private function mapNews(News $news): array
    {
        return [
            'id' => $news->id,
            'title' => $news->title,
            'excerpt' => $news->excerpt,
            'body' => $news->body,
            'raw_status' => $news->status,
            'raw_audience' => $news->audience,
            'is_pinned' => $news->is_pinned,
            'thumbnail_url' => $news->thumbnailUrl(),
            'published_at' => optional($news->published_at)->format('Y-m-d\TH:i'),
            'starts_at' => optional($news->starts_at)->format('Y-m-d\TH:i'),
            'ends_at' => optional($news->ends_at)->format('Y-m-d\TH:i'),
            'status' => $news->is_pinned ? 'Pinned' : ucfirst($news->status),
            'audience' => ucfirst($news->audience),
            'schedule' => $news->published_at ? $news->published_at->diffForHumans() : 'Belum publish',
            'attachments' => $news->attachments->map(fn (NewsAttachment $attachment) => [
                'id' => $attachment->id,
                'file_name' => $attachment->file_name,
                'file_type' => $attachment->file_type,
                'url' => $attachment->file_path ? asset("storage/{$attachment->file_path}") : null,
                'video_embed_url' => $attachment->video_embed_url,
                'size' => $attachment->file_size,
            ])->values(),
        ];
    }
}
