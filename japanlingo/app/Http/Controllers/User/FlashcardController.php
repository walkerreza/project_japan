<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Flashcard;
use App\Models\FlashcardReview;
use App\Models\FlashcardSet;
use App\Models\RewardLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FlashcardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $reviewItems = FlashcardReview::with(['flashcard.set.module.level'])
            ->where('user_id', $user->id)
            ->where('status', 'learning')
            ->latest('last_reviewed_at')
            ->get()
            ->map(function ($review) {
                $card = $review->flashcard;

                if (! $card) {
                    return null;
                }

                return [
                    'id' => $card->id,
                    'set_id' => $card->flashcard_set_id,
                    'front_text' => $card->front_text,
                    'reading' => $card->reading,
                    'back_text' => $card->back_text,
                    'hint' => $card->hint,
                    'example_sentence' => $card->example_sentence,
                    'example_meaning' => $card->example_meaning,
                    'learning_count' => $review->learning_count,
                    'last_reviewed_at' => $review->last_reviewed_at?->diffForHumans(),
                    'set_title' => $card->set?->title,
                    'module' => $card->set?->module?->title,
                    'level' => $card->set?->level?->level_name,
                ];
            })
            ->filter()
            ->values();

        $sets = FlashcardSet::with(['level:id,level_name', 'module:id,title'])
            ->withCount('flashcards')
            ->where('status', 'published')
            ->latest()
            ->get()
            ->map(function ($set) {
                return [
                    'id' => $set->id,
                    'title' => $set->title,
                    'description' => $set->description,
                    'level' => $set->level?->level_name,
                    'module' => $set->module?->title,
                    'flashcards_count' => $set->flashcards_count,
                ];
            });

        return Inertia::render('User/Flashcard/DaftarFlashcard', [
            'reviewItems' => $reviewItems,
            'sets' => $sets,
        ]);
    }

    public function show(FlashcardSet $flashcardSet)
    {
        abort_unless($flashcardSet->status === 'published', 404);

        $user = Auth::user();
        $flashcardSet->load(['flashcards.vocabulary', 'flashcards.reviews' => fn ($query) => $query->where('user_id', $user->id)]);

        $cards = $flashcardSet->flashcards->values()->map(function ($card) {
            $review = $card->reviews->first();

            return [
                'id' => $card->id,
                'front_text' => $card->front_text,
                'reading' => $card->reading,
                'back_text' => $card->back_text,
                'hint' => $card->hint,
                'example_sentence' => $card->example_sentence,
                'example_meaning' => $card->example_meaning,
                'audio_url' => $card->audio_url,
                'status' => $review?->status ?? 'new',
                'known_count' => $review?->known_count ?? 0,
                'learning_count' => $review?->learning_count ?? 0,
            ];
        });

        return Inertia::render('User/Flashcard/LatihanFlashcard', [
            'set' => [
                'id' => $flashcardSet->id,
                'title' => $flashcardSet->title,
                'description' => $flashcardSet->description,
            ],
            'cards' => $cards,
        ]);
    }

    public function review(Request $request, Flashcard $flashcard)
    {
        $validated = $request->validate([
            'action' => ['required', 'in:known,learning'],
            'completed' => ['nullable', 'boolean'],
        ]);

        $user = Auth::user();
        $review = FlashcardReview::firstOrNew([
            'user_id' => $user->id,
            'flashcard_id' => $flashcard->id,
        ]);

        if ($validated['action'] === 'known') {
            $review->status = 'known';
            $review->known_count = (int) $review->known_count + 1;
        } else {
            $review->status = 'learning';
            $review->learning_count = (int) $review->learning_count + 1;
        }

        $review->last_reviewed_at = now();
        $review->save();

        if ($request->boolean('completed')) {
            $exists = RewardLog::where('user_id', $user->id)
                ->where('source_type', 'flashcard')
                ->where('source_id', $flashcard->flashcard_set_id)
                ->exists();

            if (! $exists) {
                $user->increment('xp', 10);
                RewardLog::create([
                    'user_id' => $user->id,
                    'source_type' => 'flashcard',
                    'source_id' => $flashcard->flashcard_set_id,
                    'xp_amount' => 10,
                    'description' => 'Menyelesaikan sesi flashcard.',
                ]);
            }
        }

        return redirect()->back()->with('success', 'Progress flashcard disimpan.');
    }
}
