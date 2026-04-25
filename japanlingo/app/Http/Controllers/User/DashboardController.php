<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Module;
use App\Models\RewardLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $announcements = \Illuminate\Support\Facades\DB::table('news')
            ->where('status', 'published')
            ->whereIn('audience', ['all', 'students'])
            ->orderByDesc('published_at')
            ->take(3)
            ->get();

        return Inertia::render('User/UserDashboard', [
            'user' => $user,
            'recentProgress' => $user->progress()->with('lesson.module')->latest()->take(5)->get(),
            'availableLevels' => Level::with('modules')->get(),
            'rewardHistory' => RewardLog::where('user_id', $user->id)->latest()->take(10)->get(),
            'announcements' => $announcements,
        ]);
    }
}
