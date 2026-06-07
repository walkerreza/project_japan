<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function __invoke()
    {
        $players = User::where('role', 'user')
            ->orderByDesc('xp')
            ->take(10)
            ->get(['id', 'username', 'level', 'xp', 'streak_count'])
            ->map(fn ($user, $index) => [
                'rank' => $index + 1,
                'name' => $user->username,
                'level' => 'Level ' . $user->level,
                'xp' => $user->xp,
                'streak' => $user->streak_count,
                'avatar' => $user->username,
                'isMe' => $user->id === auth()->id(),
            ]);

        return Inertia::render('User/Leaderboard', ['players' => $players]);
    }
}
