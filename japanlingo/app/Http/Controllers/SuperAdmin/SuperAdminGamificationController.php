<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\RewardLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SuperAdminGamificationController extends SuperAdminBaseController
{
    public function __invoke()
    {
        $topUsers = User::where('role', 'user')->orderByDesc('xp')->take(5)->get();

        return Inertia::render('SuperAdmin/Gamification', [
            'stats' => [
                $this->stat('XP Terdistribusi', number_format((int) RewardLog::sum('xp_amount')), '⚡'),
                $this->stat('Achievement Unlock', number_format(DB::table('user_achievements')->count()), '🏆'),
                $this->stat('Rata-rata Streak', number_format((float) User::where('role', 'user')->avg('streak_count'), 1), '🔥'),
                $this->stat('Reward Logs', number_format(RewardLog::count()), '🎯'),
            ],
            'leaderboard' => $topUsers->map(fn (User $user, int $index) => [
                'rank' => $index + 1,
                'name' => $user->username,
                'xp' => number_format($user->xp) . ' XP',
                'streak' => $user->streak_count . ' hari',
            ]),
        ]);
    }
}
