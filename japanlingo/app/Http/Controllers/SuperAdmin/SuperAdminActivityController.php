<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\ActivityLog;
use App\Models\LoginHistory;
use Inertia\Inertia;

class SuperAdminActivityController extends SuperAdminBaseController
{
    public function __invoke()
    {
        return Inertia::render('SuperAdmin/Aktivitas/Aktivitas', [
            'activityStats' => [
                $this->stat('Aksi Hari Ini', number_format(ActivityLog::whereDate('created_at', today())->count()), '🧾'),
                $this->stat('Login Berhasil', number_format(LoginHistory::where('status', 'success')->whereDate('logged_in_at', today())->count()), '🔐'),
                $this->stat('Perubahan Status', number_format(ActivityLog::where('action', 'user.status_changed')->count()), '🛡️'),
                $this->stat('Alert Keamanan', number_format(LoginHistory::where('status', 'failed')->whereDate('logged_in_at', today())->count()), '🚨', '0', 'down'),
            ],
            'timeline' => ActivityLog::with('actor:id,username')
                ->latest()
                ->take(8)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'actor' => $log->actor?->username ?? 'System',
                    'action' => $log->action,
                    'target' => $log->target_type ? $log->target_type . ' #' . $log->target_id : '-',
                    'time' => $log->created_at->format('H:i'),
                    'tone' => str_contains($log->action, 'delete') || str_contains($log->action, 'suspend') ? 'red' : 'blue',
                ]),
            'logins' => LoginHistory::with('user:id,username')
                ->latest('logged_in_at')
                ->take(10)
                ->get()
                ->map(fn (LoginHistory $history) => [
                    'user' => $history->user?->username ?? $history->email ?? 'Unknown',
                    'role' => ucfirst($history->role ?? '-'),
                    'status' => $history->status === 'success' ? 'Berhasil' : 'Ditolak',
                    'location' => $history->ip_address ?? '-',
                    'device' => str($history->user_agent ?? '-')->limit(48)->toString(),
                ]),
        ]);
    }
}
