<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\User;
use Inertia\Inertia;

class SuperAdminUserController extends SuperAdminBaseController
{
    public function __invoke()
    {
        $students = User::where('role', 'user')->latest()->take(10)->get();

        return Inertia::render('SuperAdmin/SuperAdminUsers', [
            'stats' => [
                $this->stat('Total Student', number_format(User::where('role', 'user')->count()), '👨‍🎓'),
                $this->stat('Aktif Mingguan', number_format(User::where('role', 'user')->whereDate('last_activity_date', '>=', now()->subDays(7)->toDateString())->count()), '🔥'),
                $this->stat('Perlu Review', number_format(User::where('role', 'user')->whereNull('last_activity_date')->count()), '🕵️', '0', 'down'),
                $this->stat('Akun Suspended', number_format(User::where('role', 'user')->where('status', 'suspended')->count()), '⛔', '0', 'down'),
            ],
            'users' => $students->map(fn (User $user) => [
                'name' => $user->username,
                'email' => $user->email,
                'status' => $this->displayStatus($user->status),
                'xp' => number_format($user->xp),
                'level' => 'Lv ' . $user->level,
                'streak' => $user->streak_count . ' hari',
                'progress' => min(100, max(8, (int) round($user->xp / 20))) . '%',
            ]),
        ]);
    }
}
