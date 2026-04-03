<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $query = Lesson::with('module')->orderBy('order');

        if ($request->filled('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        $lessons = $query->get()->map(fn($l) => [
            'id'               => $l->id,
            'title'            => $l->title,
            'order'            => $l->order,
            'duration_minutes' => $l->duration_minutes,
            'module'           => $l->module ? ['id' => $l->module->id, 'title' => $l->module->title] : null,
            'quiz_count'       => $l->quizzes()->count(),
        ]);

        $modules = Module::orderBy('week_number')->get(['id', 'title', 'level_id']);

        return Inertia::render('Admin/Lessons/Index', [
            'lessons'           => $lessons,
            'modules'           => $modules,
            'selectedModuleId'  => $request->module_id,
        ]);
    }

    public function create(Request $request)
    {
        $modules = Module::orderBy('week_number')->get(['id', 'title', 'level_id']);
        return Inertia::render('Admin/Lessons/Create', [
            'modules'         => $modules,
            'defaultModuleId' => $request->module_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id'        => 'required|exists:modules,id',
            'title'            => 'required|string|max:255',
            'content'          => 'nullable|string',
            'order'            => 'required|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:1',
        ], [
            'module_id.required' => 'Modul wajib dipilih',
            'module_id.exists'   => 'Modul tidak ditemukan',
            'title.required'     => 'Judul pelajaran wajib diisi',
            'order.required'     => 'Urutan wajib diisi',
        ]);

        Lesson::create($validated);

        return redirect()->back()->with('success', 'Pelajaran berhasil dibuat');
    }

    public function edit(Lesson $lesson)
    {
        $modules = Module::orderBy('week_number')->get(['id', 'title', 'level_id']);
        return Inertia::render('Admin/Lessons/Edit', [
            'lesson'  => $lesson,
            'modules' => $modules,
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'module_id'        => 'required|exists:modules,id',
            'title'            => 'required|string|max:255',
            'content'          => 'nullable|string',
            'order'            => 'required|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:1',
        ], [
            'module_id.required' => 'Modul wajib dipilih',
            'title.required'     => 'Judul pelajaran wajib diisi',
        ]);

        $lesson->update($validated);

        return redirect()->back()->with('success', 'Pelajaran berhasil diperbarui');
    }

    public function destroy(Lesson $lesson)
    {
        if ($lesson->quizzes()->count() > 0) {
            return redirect()->back()->withErrors([
                'delete' => 'Pelajaran tidak dapat dihapus karena masih memiliki kuis',
            ]);
        }

        if ($lesson->progress()->count() > 0) {
            return redirect()->back()->withErrors([
                'delete' => 'Pelajaran tidak dapat dihapus karena sudah ada murid yang menyelesaikannya',
            ]);
        }

        $lesson->delete();

        return redirect()->back()->with('success', 'Pelajaran berhasil dihapus');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items'    => 'required|array',
            'items.*.id'    => 'required|exists:lessons,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            Lesson::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Urutan berhasil diperbarui']);
    }
}
