<?php

namespace App\Http\Controllers\User;

use App\Events\LessonCompleted;
use App\Events\QuizCompleted;
use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Progress;
use App\Models\Quiz;
use App\Services\UserProgressSummaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProgressController extends Controller
{
    public function index(UserProgressSummaryService $summary)
    {
        return Inertia::render('User/Progress/Progress', $summary->summary(Auth::user()));
    }

    public function storeAttempt(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'score' => 'required|integer',
            'xp_earned' => 'required|integer',
            'answers' => 'nullable|array',
            'answers.*.question_id' => 'required_with:answers|exists:questions,id',
            'answers.*.answer_text' => 'nullable|string',
            'answers.*.answer_payload' => 'nullable|array',
        ]);

        $attempt = DB::transaction(function () use ($validated) {
            $answers = collect($validated['answers'] ?? []);
            $quiz = $answers->isNotEmpty()
                ? Quiz::with('questions')->findOrFail($validated['quiz_id'])
                : null;
            $questionMap = $quiz?->questions->keyBy('id') ?? collect();
            $score = $answers->isNotEmpty()
                ? $this->scoreAnswers($answers, $questionMap)
                : $validated['score'];

            $attempt = Attempt::create([
                'user_id' => Auth::id(),
                'quiz_id' => $validated['quiz_id'],
                'score' => $score,
                'xp_earned' => $validated['xp_earned'],
                'attempted_at' => now(),
            ]);

            $answers->each(function ($answer) use ($attempt, $questionMap) {
                $question = $questionMap->get((int) $answer['question_id']);

                if (! $question) {
                    return;
                }

                $answerText = $answer['answer_text'] ?? null;
                $isCorrect = $this->isAnswerCorrect($answerText ?? '', $question->correct_answer);

                $attempt->answers()->create([
                    'question_id' => $question->id,
                    'answer_text' => $answerText,
                    'answer_payload' => $answer['answer_payload'] ?? null,
                    'is_correct' => $isCorrect,
                    'earned_points' => $isCorrect ? 10 : 0,
                ]);
            });

            return $attempt;
        });

        event(new QuizCompleted(Auth::user(), $validated['quiz_id'], $attempt->score, $validated['xp_earned']));

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

    private function scoreAnswers($answers, $questionMap): int
    {
        return $answers
            ->filter(fn ($answer) => $questionMap->has((int) $answer['question_id']))
            ->filter(fn ($answer) => $this->isAnswerCorrect(
                $answer['answer_text'] ?? '',
                $questionMap->get((int) $answer['question_id'])->correct_answer
            ))
            ->count();
    }

    private function isAnswerCorrect(string $answer, string $correctAnswer): bool
    {
        return $this->normalizeAnswer($answer) === $this->normalizeAnswer($correctAnswer);
    }

    private function normalizeAnswer(string $value): string
    {
        return mb_strtolower(trim(preg_replace('/\s+/u', ' ', $value)));
    }
}
