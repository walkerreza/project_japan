<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Lesson;
use App\Models\Level;
use App\Models\Progress;
use App\Models\User;

class CertificateService
{
    public function checkAndIssueCertificate(User $user, int $levelId): ?Certificate
    {
        $existing = Certificate::where('user_id', $user->id)->where('level_id', $levelId)->first();
        if ($existing) {
            return $existing;
        }

        $level = Level::with('modules.lessons')->find($levelId);
        if (!$level) return null;

        $totalLessons = 0;
        $lessonIds = [];
        foreach ($level->modules as $module) {
            foreach ($module->lessons as $lesson) {
                $totalLessons++;
                $lessonIds[] = $lesson->id;
            }
        }

        if ($totalLessons === 0) return null;

        $completedCount = Progress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->count();

        if ($completedCount < $totalLessons) return null;

        $certNumber = 'CERT-' . date('Y') . '-' . str_pad($user->id, 5, '0', STR_PAD_LEFT);

        return Certificate::create([
            'user_id' => $user->id,
            'level_id' => $levelId,
            'issued_at' => now(),
            'certificate_number' => $certNumber,
        ]);
    }

    public function getProgressPercentage(User $user, int $levelId): float
    {
        $level = Level::with('modules.lessons')->find($levelId);
        if (!$level) return 0;

        $lessonIds = [];
        foreach ($level->modules as $module) {
            foreach ($module->lessons as $lesson) {
                $lessonIds[] = $lesson->id;
            }
        }

        $total = count($lessonIds);
        if ($total === 0) return 0;

        $completed = Progress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->count();

        return round(($completed / $total) * 100, 1);
    }
}
