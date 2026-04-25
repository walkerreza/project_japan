<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\ActivityLog;
use App\Models\User;
use Inertia\Inertia;

class SuperAdminAdminController extends SuperAdminBaseController
{
    public function __invoke()
    {
        $admins = User::whereIn('role', ['admin', 'superadmin'])->latest()->take(10)->get();

        return Inertia::render('SuperAdmin/Admins', [
            'stats' => [
                $this->stat('Admin Aktif', number_format(User::where('role', 'admin')->where('status', 'active')->count()), '🛡️'),
                $this->stat('Superadmin', number_format(User::where('role', 'superadmin')->count()), '👑'),
                $this->stat('Aksi Hari Ini', number_format(ActivityLog::whereDate('created_at', today())->count()), '⚙️'),
                $this->stat('Nonaktif', number_format(User::whereIn('role', ['admin', 'superadmin'])->where('status', '!=', 'active')->count()), '⛔', '0', 'down'),
            ],
            'admins' => $admins->map(fn (User $user) => [
                'name' => $user->username,
                'role' => ucfirst($user->role),
                'focus' => $user->role === 'superadmin' ? 'Platform oversight' : 'Content operations',
                'updated' => optional($user->updated_at)->diffForHumans() ?? '-',
                'status' => $this->displayStatus($user->status),
            ]),
            'activities' => ActivityLog::with('actor:id,username')
                ->whereHas('actor', fn ($query) => $query->whereIn('role', ['admin', 'superadmin']))
                ->latest()
                ->take(3)
                ->get()
                ->map(fn (ActivityLog $log) => $log->description ?: $log->action)
                ->values(),
        ]);
    }
}
