<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::with(['level', 'lessons'])
            ->orderBy('level_id')
            ->orderBy('week_number')
            ->get()
            ->map(fn($m) => [
                'id'           => $m->id,
                'title'        => $m->title,
                'description'  => $m->description,
                'week_number'  => $m->week_number,
                'level'        => $m->level,
                'lesson_count' => $m->lessons->count(),
            ]);

        $levels = Level::orderBy('stage')->get();

        return Inertia::render('Admin/Modules/Index', [
            'modules' => $modules,
            'levels'  => $levels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'level_id'    => 'required|exists:levels,id',
            'title'       => 'required|string|max:255',
            'week_number' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ], [
            'level_id.required'    => 'Level wajib dipilih',
            'level_id.exists'      => 'Level tidak ditemukan',
            'title.required'       => 'Judul modul wajib diisi',
            'week_number.required' => 'Nomor minggu wajib diisi',
            'week_number.integer'  => 'Nomor minggu harus berupa angka',
        ]);

        Module::create($validated);

        return redirect()->back()->with('success', 'Modul berhasil dibuat');
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'level_id'    => 'required|exists:levels,id',
            'title'       => 'required|string|max:255',
            'week_number' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ], [
            'level_id.required'    => 'Level wajib dipilih',
            'title.required'       => 'Judul modul wajib diisi',
            'week_number.required' => 'Nomor minggu wajib diisi',
        ]);

        $module->update($validated);

        return redirect()->back()->with('success', 'Modul berhasil diperbarui');
    }

    public function destroy(Module $module)
    {
        $lessonCount = $module->lessons()->count();

        if ($lessonCount > 0) {
            return redirect()->back()->withErrors([
                'delete' => "Modul tidak dapat dihapus karena masih memiliki {$lessonCount} pelajaran",
            ]);
        }

        $module->delete();

        return redirect()->back()->with('success', 'Modul berhasil dihapus');
    }

    public function builder(Module $module)
    {
        $module->load(['level', 'lessons' => function($q) {
            $q->orderBy('order');
        }]);

        return Inertia::render('Admin/Builders/ContentEditor', [
            'module'  => $module,
            'lessons' => $module->lessons,
        ]);
    }

    public function updateContent(Request $request, Module $module)
    {
        $lessonsData = $request->input('lessons', []);
        $lessonsFiles = $request->file('lessons', []);
        
        $lessonIds = [];
        
        foreach ($lessonsData as $index => $data) {
            $updateData = [
                'title'            => $data['title'] ?? 'Untitled',
                'content'          => $data['content'] ?? '',
                'type'             => $data['type'] ?? 'text',
                'video_url'        => $data['video_url'] ?? null,
                'order'            => $index,
                'duration_minutes' => $data['duration_minutes'] ?? 5,
            ];

            // Cari file yang diunggah untuk index ini
            $uploadedFile = $lessonsFiles[$index]['file_uploaded'] ?? null;

            if ($uploadedFile) {
                // Hapus file lama jika ada
                $existingLesson = $module->lessons()->find($data['id'] ?? null);
                if ($existingLesson && $existingLesson->file_url) {
                    \Storage::disk('public')->delete($existingLesson->file_url);
                }
                
                // Simpan file baru
                $path = $uploadedFile->store('lessons', 'public');
                $updateData['file_url'] = $path;
            } else {
                // Jika tidak ada file baru, tetap gunakan yang lama (jika ada)
                $updateData['file_url'] = $data['file_url'] ?? null;
            }

            $lesson = $module->lessons()->updateOrCreate(
                ['id' => $data['id'] ?? null],
                $updateData
            );
            
            $lessonIds[] = $lesson->id;
        }

        // Hapus pelajaran yang tidak ada dalam request
        $module->lessons()->whereNotIn('id', $lessonIds)->delete();

        return redirect()->back()->with('success', 'Konten modul berhasil disimpan');
    }
}
