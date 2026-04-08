<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\LessonCompleted;
use App\Events\QuizCompleted;

class ProgressController extends Controller
{
    public function storeAttempt(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'score' => 'required|integer',
            'xp_earned' => 'required|integer',
        ]);

        Attempt::create([
            'user_id' => Auth::id(),
            ...$validated,
            'attempted_at' => now(),
        ]);

        event(new QuizCompleted(Auth::user(), $validated['quiz_id'], $validated['score'], $validated['xp_earned']));

        return redirect()->back();
    }

    public function completeLesson(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'score' => 'nullable|integer',
        ]);

        Progress::firstOrCreate([
            'user_id' => Auth::id(),
            'lesson_id' => $validated['lesson_id'],
        ], [
            'score' => $validated['score'] ?? null,
            'completed_at' => now(),
        ]);

        event(new LessonCompleted(Auth::user(), $validated['lesson_id'], $validated['score'] ?? null));

        return redirect()->back();
    }
}
