<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\ActivityLog;
use App\Models\Lesson;
use App\Models\Module as LearningModule;
use App\Models\News;
use App\Models\Quiz;
use Inertia\Inertia;

class SuperAdminContentController extends SuperAdminBaseController
{
    public function __invoke()
    {
        return Inertia::render('SuperAdmin/Content', [
            'stats' => [
                $this->stat('Module Aktif', number_format(LearningModule::count()), '📚'),
                $this->stat('Lesson Publish', number_format(Lesson::count()), '📝'),
                $this->stat('Quiz Siap Pakai', number_format(Quiz::count()), '❓'),
                $this->stat('News Aktif', number_format(News::where('status', 'published')->count()), '📰'),
            ],
            'news' => News::with('creator:id,username')
                ->latest()
                ->take(6)
                ->get()
                ->map(fn (News $news) => [
                    'title' => $news->title,
                    'status' => $news->is_pinned ? 'Pinned' : ucfirst($news->status),
                    'audience' => ucfirst($news->audience),
                    'schedule' => $news->published_at ? $news->published_at->diffForHumans() : 'Belum publish',
                ]),
            'updates' => ActivityLog::with('actor:id,username')
                ->whereIn('target_type', ['module', 'lesson', 'quiz', 'news'])
                ->latest()
                ->take(4)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'item' => $log->target_type ? ucfirst($log->target_type) . ' #' . $log->target_id : $log->action,
                    'by' => $log->actor?->username ?? 'System',
                    'state' => 'Updated',
                ]),
        ]);
    }
}
