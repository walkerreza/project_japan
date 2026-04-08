<?php

namespace App\Services;

use App\Models\User;

class AchievementService
{
    /**
     * Evaluate and unlock achievements for a user based on activity.
     */
    public function evaluateAchievements(User $user, string $activityType, array $context = []): array
    {
        // Fitur ini di-skip pada tahap refaktorisasi ini sesuai instruksi.
        return [];
    }
}
