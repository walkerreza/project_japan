<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\ActivityLog;
use App\Models\Attempt;
use App\Models\LoginHistory;
use App\Models\News;
use App\Models\Progress;
use App\Models\RewardLog;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class SuperAdminDashboardController extends SuperAdminBaseController
{
    public function __invoke()
    {
        $studentCount = User::where('role', 'user')->count();
        $activeLearners = User::where('role', 'user')
            ->whereDate('last_activity_date', '>=', now()->subDays(7)->toDateString())
            ->count();

        return Inertia::render('SuperAdmin/Beranda', [
            'metrics' => [
                $this->stat('Total Student', number_format($studentCount), '👥'),
                $this->stat('Learner Aktif', number_format($activeLearners), '🔥'),
                $this->stat('Total Admin', number_format(User::where('role', 'admin')->count()), '🛡️'),
                $this->stat('Quiz Attempt', number_format(Attempt::count()), '❓'),
                $this->stat('XP Terdistribusi', number_format((int) RewardLog::sum('xp_amount')), '⚡'),
                $this->stat('News Aktif', number_format(News::where('status', 'published')->count()), '📰'),
            ],
            'alerts' => $this->dashboardAlerts(),
            'activities' => ActivityLog::with('actor:id,username')
                ->latest()
                ->take(3)
                ->get()
                ->map(fn (ActivityLog $log) => $log->description ?: $log->action)
                ->values(),
            'learningBars' => $this->learningBars(),
        ]);
    }

    private function dashboardAlerts(): array
    {
        $alerts = [];

        if (LoginHistory::where('status', 'failed')->whereDate('logged_in_at', today())->exists()) {
            $alerts[] = ['tone' => 'red', 'text' => 'Ada percobaan login gagal hari ini.'];
        }

        if (News::where('status', 'draft')->exists()) {
            $alerts[] = ['tone' => 'amber', 'text' => 'Ada news draft yang belum dipublish.'];
        }

        $alerts[] = ['tone' => 'blue', 'text' => 'Gamifikasi N3 aktif dan reward log tersedia.'];

        return $alerts;
    }

    private function learningBars(): array
    {
        return collect(range(6, 0))
            ->map(function (int $daysAgo, int $index) {
                $date = Carbon::today()->subDays($daysAgo);

                return [
                    'label' => 'D' . ($index + 1),
                    'lesson' => 20 + Progress::query()->whereDate('updated_at', $date)->count() * 8,
                    'quiz' => 20 + Attempt::query()->whereDate('attempted_at', $date)->count() * 8,
                ];
            })
            ->values()
            ->all();
    }
}
