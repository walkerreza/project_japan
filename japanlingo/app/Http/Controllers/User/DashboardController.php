<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Module;
use App\Models\News;
use App\Models\RewardLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $news = News::query()
            ->with('attachments')
            ->where('status', 'published')
            ->whereIn('audience', ['all', 'students'])
            ->where(function ($query) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            })
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->take(3)
            ->get()
            ->map(function (News $news) {
                $thumbnailUrl = $news->thumbnailUrl();

                return [
                    'id' => $news->id,
                    'title' => $news->title,
                    'excerpt' => $news->excerpt,
                    'body' => $news->body,
                    'is_pinned' => $news->is_pinned,
                    'published_at' => optional($news->published_at)->toIso8601String(),
                    'thumbnail_url' => $thumbnailUrl,
                    'cover_url' => $thumbnailUrl,
                ];
            });

        return Inertia::render('User/UserDashboard', [
            'user' => $user,
            'recentProgress' => $user->progress()->with('lesson.module')->latest()->take(5)->get(),
            'availableLevels' => Level::with('modules')->get(),
            'rewardHistory' => RewardLog::where('user_id', $user->id)->latest()->take(10)->get(),
            'news' => $news,
        ]);
    }
}
