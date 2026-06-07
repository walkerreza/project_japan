<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Level;
use App\Models\Module;
use App\Models\TeachingBoard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTeachingBoardController extends Controller
{
    public function index(Request $request)
    {
        $query = TeachingBoard::with(['level:id,level_name', 'module:id,title', 'lesson:id,title'])
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

        return Inertia::render('Admin/BoardAjar/ManajemenBoard', [
            'boards' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search', 'status'),
            'levels' => Level::orderBy('stage')->get(['id', 'level_name']),
            'modules' => Module::orderBy('week_number')->get(['id', 'title']),
            'lessons' => Lesson::orderBy('order')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request)
    {
        $board = TeachingBoard::create($this->validateBoard($request) + [
            'board_data' => ['strokes' => []],
        ]);

        return redirect()->route('admin.boards.editor', $board)->with('success', 'Board ajar berhasil dibuat.');
    }

    public function update(Request $request, TeachingBoard $board)
    {
        $board->update($this->validateBoard($request));

        return redirect()->back()->with('success', 'Board ajar berhasil diperbarui.');
    }

    public function destroy(TeachingBoard $board)
    {
        $board->delete();

        return redirect()->back()->with('success', 'Board ajar berhasil dihapus.');
    }

    public function editor(TeachingBoard $board)
    {
        $board->load(['level:id,level_name', 'module:id,title', 'lesson:id,title']);

        return Inertia::render('Admin/BoardAjar/EditorBoard', [
            'board' => $board,
        ]);
    }

    public function saveCanvas(Request $request, TeachingBoard $board)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:draft,published'],
            'board_data' => ['nullable', 'array'],
            'snapshot_data' => ['nullable', 'string'],
        ]);

        $board->update([
            'status' => $validated['status'],
            'board_data' => $validated['board_data'] ?? ['strokes' => []],
            'snapshot_data' => $validated['snapshot_data'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Board ajar berhasil disimpan.');
    }

    private function validateBoard(Request $request): array
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
