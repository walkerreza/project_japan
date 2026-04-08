<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuizCompleted
{
    use Dispatchable, SerializesModels;

    public $user;
    public $quizId;
    public $score;
    public $xpEarned;

    public function __construct(User $user, int $quizId, int $score, int $xpEarned)
    {
        $this->user = $user;
        $this->quizId = $quizId;
        $this->score = $score;
        $this->xpEarned = $xpEarned;
    }
}
