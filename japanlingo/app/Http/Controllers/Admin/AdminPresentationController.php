<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Level;
use App\Models\Module;
use App\Models\PresentationDeck;
use App\Models\PresentationSlide;
use App\Services\PresentationImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminPresentationController extends Controller
{
    public function index(Request $request)
    {
        $query = PresentationDeck::with(['level:id,level_name', 'module:id,title', 'lesson:id,title'])
            ->withCount('slides')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($query) use ($search) {
                $query->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Presentasi/ManajemenPresentasi', [
            'decks' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search', 'status'),
            'levels' => Level::orderBy('stage')->get(['id', 'level_name']),
            'modules' => Module::orderBy('week_number')->get(['id', 'title']),
            'lessons' => Lesson::orderBy('order')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateDeck($request);

        $deck = DB::transaction(function () use ($validated) {
            $deck = PresentationDeck::create($validated);
            $deck->slides()->create([
                'title' => $deck->title,
                'layout' => 'title',
                'content' => $deck->description ?: 'Tulis pembuka presentasi di sini.',
                'background' => 'sunrise',
                'accent_color' => '#E64A19',
                'order' => 0,
            ]);

            return $deck;
        });

        return redirect()->route('admin.presentations.builder', $deck)->with('success', 'Presentasi berhasil dibuat.');
    }

    public function update(Request $request, PresentationDeck $presentationDeck)
    {
        $presentationDeck->update($this->validateDeck($request));

        return redirect()->back()->with('success', 'Presentasi berhasil diperbarui.');
    }

    public function destroy(PresentationDeck $presentationDeck)
    {
        $presentationDeck->delete();

        return redirect()->back()->with('success', 'Presentasi berhasil dihapus.');
    }

    public function builder(PresentationDeck $presentationDeck)
    {
        $presentationDeck->load(['level:id,level_name', 'module:id,title', 'lesson:id,title', 'slides.board']);

        return Inertia::render('Admin/Presentasi/BuilderPresentasi', [
            'deck' => $presentationDeck,
        ]);
    }

    public function updateSlides(Request $request, PresentationDeck $presentationDeck)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:draft,published'],
            'slides' => ['present', 'array'],
            'slides.*.id' => ['nullable', 'integer'],
            'slides.*.title' => ['nullable', 'string', 'max:255'],
            'slides.*.layout' => ['required', Rule::in(['title', 'content', 'vocabulary', 'kanji', 'media', 'question', 'board'])],
            'slides.*.content' => ['nullable', 'string'],
            'slides.*.media_url' => ['nullable', 'string', 'max:2048'],
            'slides.*.background' => ['required', Rule::in(['light', 'dark', 'sunrise', 'sakura', 'ocean', 'forest'])],
            'slides.*.accent_color' => ['nullable', 'string', 'max:20'],
            'slides.*.speaker_notes' => ['nullable', 'string'],
            'slides.*.board_data' => ['nullable', 'array'],
            'slides.*.snapshot_data' => ['nullable', 'string'],
        ]);

        $ids = [];

        DB::transaction(function () use ($presentationDeck, $validated, &$ids) {
            $presentationDeck->update(['status' => $validated['status']]);

            foreach ($validated['slides'] as $index => $slide) {
                $model = $presentationDeck->slides()->updateOrCreate(
                    ['id' => $slide['id'] ?? null],
                    [
                        'title' => $slide['title'] ?? null,
                        'layout' => $slide['layout'],
                        'content' => $slide['content'] ?? null,
                        'media_url' => $slide['media_url'] ?? null,
                        'background' => $slide['background'],
                        'accent_color' => $slide['accent_color'] ?? '#E64A19',
                        'speaker_notes' => $slide['speaker_notes'] ?? null,
                        'order' => $index,
                    ]
                );

                if ($model->layout === 'board') {
                    $model->board()->updateOrCreate(
                        ['presentation_slide_id' => $model->id],
                        [
                            'level_id' => $presentationDeck->level_id,
                            'module_id' => $presentationDeck->module_id,
                            'lesson_id' => $presentationDeck->lesson_id,
                            'title' => $model->title ?: 'Board Presentasi',
                            'description' => 'Board dari presentasi ' . $presentationDeck->title,
                            'board_data' => $slide['board_data'] ?? ['strokes' => []],
                            'snapshot_data' => $slide['snapshot_data'] ?? null,
                            'status' => $presentationDeck->status,
                        ]
                    );
                } else {
                    $model->board()->delete();
                }

                $ids[] = $model->id;
            }

            $presentationDeck->slides()->whereNotIn('id', $ids)->delete();
        });

        return redirect()->back()->with('success', 'Slide presentasi berhasil disimpan.');
    }

    public function importPptx(Request $request, PresentationDeck $presentationDeck, PresentationImportService $importer)
    {
        $validated = $request->validate([
            'pptx_file' => ['required', 'file', 'mimes:pptx', 'max:65536'],
        ]);

        $count = $importer->importPptx($presentationDeck, $validated['pptx_file']);

        return redirect()->back()->with('success', "{$count} slide berhasil diimport dari PPTX.");
    }

    public function saveSlideBoard(Request $request, PresentationDeck $presentationDeck, PresentationSlide $presentationSlide)
    {
        abort_unless($presentationSlide->presentation_deck_id === $presentationDeck->id, 404);
        abort_unless($presentationSlide->layout === 'board', 404);

        $validated = $request->validate([
            'status' => ['required', 'in:draft,published'],
            'board_data' => ['nullable', 'array'],
            'snapshot_data' => ['nullable', 'string'],
        ]);

        $presentationSlide->board()->updateOrCreate(
            ['presentation_slide_id' => $presentationSlide->id],
            [
                'level_id' => $presentationDeck->level_id,
                'module_id' => $presentationDeck->module_id,
                'lesson_id' => $presentationDeck->lesson_id,
                'title' => $presentationSlide->title ?: 'Board Presentasi',
                'description' => 'Board dari presentasi ' . $presentationDeck->title,
                'board_data' => $validated['board_data'] ?? ['strokes' => []],
                'snapshot_data' => $validated['snapshot_data'] ?? null,
                'status' => $validated['status'],
            ]
        );

        return redirect()->back()->with('success', 'Board presentasi berhasil disimpan.');
    }

    public function presenter(PresentationDeck $presentationDeck)
    {
        $presentationDeck->load(['module:id,title', 'lesson:id,title', 'slides.board']);

        return Inertia::render('Admin/Presentasi/ModePresentasi', [
            'deck' => $presentationDeck,
        ]);
    }

    private function validateDeck(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'level_id' => ['nullable', 'integer', 'exists:levels,id'],
            'module_id' => ['nullable', 'integer', 'exists:modules,id'],
            'lesson_id' => ['nullable', 'integer', 'exists:lessons,id'],
            'status' => ['required', 'in:draft,published'],
        ]);
    }
}
