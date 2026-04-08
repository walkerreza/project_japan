<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LessonCompleted
{
    use Dispatchable, SerializesModels;

    public $user;
    public $lessonId;
    public $score;

    public function __construct(User $user, int $lessonId, ?int $score = null)
    {
        $this->user = $user;
        $this->lessonId = $lessonId;
        $this->score = $score;
    }
}
