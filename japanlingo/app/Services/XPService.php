<?php

namespace App\Services;

use App\Models\User;

class XPService
{
    private const LEVEL_THRESHOLDS = [
        1 => 0,
        2 => 100,
        3 => 300,
        4 => 600,
        5 => 1000,
        6 => 1500,
    ];

    /**
     * Award XP to a user and update their level if necessary
     */
    public function awardXP(User $user, int $amount, string $source): array
    {
        $user->xp += $amount;
        $newLevel = $this->calculateLevel($user->xp);
        
        $levelUp = false;
        if ($newLevel > $user->level) {
            $user->level = $newLevel;
            $levelUp = true;
        }

        $user->save();

        return [
            'xp_awarded' => $amount,
            'level_up' => $levelUp,
            'new_level' => $user->level
        ];
    }

    /**
     * Calculate the level for a given XP total
     */
    public function calculateLevel(int $xp): int
    {
        $level = 1;
        foreach (self::LEVEL_THRESHOLDS as $lvl => $threshold) {
            if ($xp >= $threshold) {
                $level = $lvl;
            } else {
                break;
            }
        }
        return $level;
    }

    /**
     * Calculate quiz XP based on score percentage
     */
    public function calculateQuizXP(float $scorePercentage): int
    {
        if ($scorePercentage >= 100) return 50;
        if ($scorePercentage >= 80) return 35;
        if ($scorePercentage >= 60) return 20;
        return 0;
    }
}
