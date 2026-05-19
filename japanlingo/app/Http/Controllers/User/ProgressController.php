<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\LessonCompleted;
use App\Events\QuizCompleted;
use App\Models\Quiz;

class ProgressController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Basic Stats
        $lessonsDone = Progress::where('user_id', $user->id)->count();
        $quizzesDone = Attempt::where('user_id', $user->id)->distinct('quiz_id')->count();

        // 2. Weekly Activity (7 days)
        $weekActivity = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $xp = \App\Models\RewardLog::where('user_id', $user->id)
                ->whereDate('created_at', $date->toDateString())
                ->sum('xp_amount');
            
            $weekActivity->push([
                'day' => $date->translatedFormat('D'), // Sen, Sel, etc.
                'xp' => (int)$xp,
                'height' => $xp > 0 ? min(100, max(10, ($xp / 500) * 100)) . '%' : '0%', // 500 max cap height
                'today' => $i === 0,
            ]);
        }

        // 3. JLPT Journey
        $levels = \App\Models\Level::with('modules.lessons')->orderBy('stage')->get();
        $completedLessonIds = Progress::where('user_id', $user->id)->pluck('lesson_id')->toArray();
        
        $jlptJourney = $levels->map(function ($level) use ($completedLessonIds) {
            $totalLessons = $level->modules->pluck('lessons')->flatten()->count();
            $completedCount = 0;
            if ($totalLessons > 0) {
                foreach ($level->modules->pluck('lessons')->flatten() as $lesson) {
                    if (in_array($lesson->id, $completedLessonIds)) {
                        $completedCount++;
                    }
                }
            }
            
            $pct = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;
            return [
                'level' => $level->level_name,
                'pct' => $pct,
                'done' => $pct === 100 && $totalLessons > 0,
            ];
        });

        // 4. Recent Activity
        $recentActivity = \App\Models\RewardLog::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'text' => $log->description,
                    'xp' => '+' . $log->xp_amount . ' XP',
                    'time' => $log->created_at->diffForHumans(),
                    'type' => $log->source_type, // 'lesson', 'quiz', 'achievement'
                ];
            });

        // 5. Skills (Baseline dari total lesson/kuis + bonus Keyword scanning)
        $grammarCount = $lessonsDone * 5;
        $kanjiCount = $lessonsDone * 2;
        $vocabCount = $lessonsDone * 8;
        $listenCount = $quizzesDone * 5;
        $readCount = ($lessonsDone * 3) + ($quizzesDone * 3);

        $completedLessonsData = \App\Models\Lesson::whereIn('id', $completedLessonIds)->get();
        $grammarCount += $completedLessonsData->filter(fn($l) => stripos($l->title, 'grammar') !== false || stripos($l->title, 'partikel') !== false || stripos($l->title, 'pola') !== false)->count() * 15;
        $kanjiCount += $completedLessonsData->filter(fn($l) => stripos($l->title, 'kanji') !== false)->count() * 15;
        $vocabCount += $completedLessonsData->filter(fn($l) => stripos($l->title, 'vocab') !== false || stripos($l->title, 'kosakata') !== false)->count() * 15;
        $listenCount += $completedLessonsData->filter(fn($l) => stripos($l->title, 'listen') !== false || stripos($l->title, 'audio') !== false || !empty($l->audio_url))->count() * 20;
        $readCount += $completedLessonsData->filter(fn($l) => stripos($l->title, 'read') !== false || stripos($l->title, 'baca') !== false || stripos($l->title, 'dokkai') !== false)->count() * 15;

        $attemptedQuizIds = \App\Models\Attempt::where('user_id', $user->id)->pluck('quiz_id')->unique()->toArray();
        $completedQuizzesData = \App\Models\Quiz::whereIn('id', $attemptedQuizIds)->get();
        $grammarCount += $completedQuizzesData->filter(fn($q) => stripos($q->title, 'grammar') !== false || stripos($q->title, 'partikel') !== false)->count() * 10;
        $vocabCount += $completedQuizzesData->filter(fn($q) => stripos($q->title, 'vocab') !== false || stripos($q->title, 'kosakata') !== false)->count() * 10;
        $kanjiCount += $completedQuizzesData->filter(fn($q) => stripos($q->title, 'kanji') !== false)->count() * 10;

        $skills = [
            ['label' => 'Grammar', 'value' => min(100, $grammarCount), 'color' => 'bg-red-500'],
            ['label' => 'Kanji', 'value' => min(100, $kanjiCount), 'color' => 'bg-blue-500'],
            ['label' => 'Vocabulary', 'value' => min(100, $vocabCount), 'color' => 'bg-green-500'],
            ['label' => 'Listening', 'value' => min(100, $listenCount), 'color' => 'bg-amber-500'],
            ['label' => 'Reading', 'value' => min(100, $readCount), 'color' => 'bg-purple-500'],
        ];

        return \Inertia\Inertia::render('User/Progress', [
            'stats' => [
                'xp' => number_format($user->xp),
                'streak' => $user->streak_count,
                'lessonsDone' => $lessonsDone,
                'quizzesDone' => $quizzesDone,
            ],
            'weekActivity' => $weekActivity,
            'jlptJourney' => $jlptJourney,
            'recentActivity' => $recentActivity,
            'skills' => $skills,
        ]);
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
            $score = $validated['score'];

            if ($answers->isNotEmpty()) {
                $quiz = Quiz::with('questions')->findOrFail($validated['quiz_id']);
                $questionMap = $quiz->questions->keyBy('id');

                $score = $answers
                    ->filter(fn ($answer) => $questionMap->has((int) $answer['question_id']))
                    ->filter(fn ($answer) => $this->isAnswerCorrect(
                        $answer['answer_text'] ?? '',
                        $questionMap->get((int) $answer['question_id'])->correct_answer
                    ))
                    ->count();
            }

            $attempt = Attempt::create([
                'user_id' => Auth::id(),
                'quiz_id' => $validated['quiz_id'],
                'score' => $score,
                'xp_earned' => $validated['xp_earned'],
                'attempted_at' => now(),
            ]);

            if ($answers->isNotEmpty()) {
                $quiz = Quiz::with('questions')->findOrFail($validated['quiz_id']);
                $questionMap = $quiz->questions->keyBy('id');

                foreach ($answers as $answer) {
                    $question = $questionMap->get((int) $answer['question_id']);

                    if (! $question) {
                        continue;
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
                }
            }

            return $attempt;
        });

        event(new QuizCompleted(Auth::user(), $validated['quiz_id'], $attempt->score, $validated['xp_earned']));

        return redirect()->back();
    }

    private function isAnswerCorrect(string $answer, string $correctAnswer): bool
    {
        return $this->normalizeAnswer($answer) === $this->normalizeAnswer($correctAnswer);
    }

    private function normalizeAnswer(string $value): string
    {
        return mb_strtolower(trim(preg_replace('/\s+/u', ' ', $value)));
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
