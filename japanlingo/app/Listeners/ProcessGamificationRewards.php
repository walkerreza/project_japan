<?php

namespace App\Listeners;

use App\Events\LessonCompleted;
use App\Events\QuizCompleted;
use App\Services\XPService;
use App\Services\StreakService;
use Illuminate\Events\Dispatcher;

class ProcessGamificationRewards
{
    protected $xpService;
    protected $streakService;

    public function __construct(XPService $xpService, StreakService $streakService)
    {
        $this->xpService = $xpService;
        $this->streakService = $streakService;
    }

    public function handleLessonCompleted(LessonCompleted $event)
    {
        $streakInfo = $this->streakService->updateStreak($event->user);
        
        // 10 is base xp for lesson
        $totalXp = 10 + $streakInfo['bonus_xp'];
        $this->xpService->awardXP($event->user, $totalXp, 'lesson');
    }

    public function handleQuizCompleted(QuizCompleted $event)
    {
        $streakInfo = $this->streakService->updateStreak($event->user);
        
        $totalXp = $event->xpEarned + $streakInfo['bonus_xp'];
        $this->xpService->awardXP($event->user, $totalXp, 'quiz');
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
