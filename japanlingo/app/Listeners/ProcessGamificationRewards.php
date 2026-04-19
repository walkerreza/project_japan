<?php

namespace App\Listeners;

use App\Events\LessonCompleted;
use App\Events\QuizCompleted;
use App\Services\XPService;
use App\Services\StreakService;
use App\Services\AchievementService;
use Illuminate\Events\Dispatcher;

class ProcessGamificationRewards
{
    protected $xpService;
    protected $streakService;
    protected $achievementService;

    public function __construct(XPService $xpService, StreakService $streakService, AchievementService $achievementService)
    {
        $this->xpService = $xpService;
        $this->streakService = $streakService;
        $this->achievementService = $achievementService;
    }

    public function handleLessonCompleted(LessonCompleted $event)
    {
        $streakInfo = $this->streakService->updateStreak($event->user);
        
        $totalXp = 10 + $streakInfo['bonus_xp'];
        $this->xpService->awardXP($event->user, $totalXp, 'lesson', $event->lessonId, 'Penyelesaian Pelajaran');

        $newAchievements = $this->achievementService->evaluateAchievements($event->user, 'lesson');

        if (!empty($newAchievements)) {
            session()->flash('newAchievements', $newAchievements);
        }
    }

    public function handleQuizCompleted(QuizCompleted $event)
    {
        $streakInfo = $this->streakService->updateStreak($event->user);
        
        $totalXp = $event->xpEarned + $streakInfo['bonus_xp'];
        $this->xpService->awardXP($event->user, $totalXp, 'quiz', $event->quizId, 'Penyelesaian Kuis');

        $newAchievements = $this->achievementService->evaluateAchievements($event->user, 'quiz');

        if (!empty($newAchievements)) {
            session()->flash('newAchievements', $newAchievements);
        }
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            LessonCompleted::class,
            [ProcessGamificationRewards::class, 'handleLessonCompleted']
        );

        $events->listen(
            QuizCompleted::class,
            [ProcessGamificationRewards::class, 'handleQuizCompleted']
        );
    }
}
