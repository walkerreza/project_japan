<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;
use App\Models\Progress;
use App\Models\Attempt;

class AchievementService
{
    protected XPService $xpService;

    public function __construct(XPService $xpService)
    {
        $this->xpService = $xpService;
    }

    public function evaluateAchievements(User $user, string $activityType, array $context = []): array
    {
        $newlyUnlocked = [];
        $alreadyUnlockedIds = $user->achievements()->pluck('achievements.id')->toArray();
        $achievements = Achievement::whereNotIn('id', $alreadyUnlockedIds)->get();

        foreach ($achievements as $achievement) {
            if ($this->checkCondition($user, $achievement)) {
                $user->achievements()->attach($achievement->id, [
                    'unlocked_at' => now(),
                ]);

                if ($achievement->xp_reward > 0) {
                    $this->xpService->awardXP(
                        $user,
                        $achievement->xp_reward,
                        'achievement',
                        $achievement->id,
                        "Lencana: {$achievement->name}"
                    );
                }

                $newlyUnlocked[] = [
                    'id' => $achievement->id,
                    'name' => $achievement->name,
                    'description' => $achievement->description,
                    'icon' => $achievement->icon,
                    'xp_reward' => $achievement->xp_reward,
                ];
            }
        }

        return $newlyUnlocked;
    }

    protected function checkCondition(User $user, Achievement $achievement): bool
    {
        return match ($achievement->condition_type) {
            'lessons_completed' => Progress::where('user_id', $user->id)->count() >= $achievement->condition_value,
            'quiz_perfect' => Attempt::where('user_id', $user->id)->where('score', 100)->count() >= $achievement->condition_value,
            'streak_days' => ($user->streak_count ?? 0) >= $achievement->condition_value,
            default => false,
        };
    }
}
