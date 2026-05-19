<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Level;
use App\Models\Kanji;
use App\Http\Requests\Admin\ModuleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminModuleController extends Controller
{
    public function index(Request $request)
    {
        $query = Module::with(['level', 'lessons'])->orderBy('level_id')->orderBy('week_number');

        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        $modules = $query->paginate(10)->through(fn($m) => [
                'id'           => $m->id,
                'title'        => $m->title,
                'description'  => $m->description,
                'week_number'  => $m->week_number,
                'status'       => $m->status ?? 'published',
                'level'        => $m->level,
                'lesson_count' => $m->lessons->count(),
            ]);

        $levels = Level::orderBy('stage')->get();

        return Inertia::render('Admin/Modules/AdminModulesIndex', [
            'modules' => $modules,
            'levels'  => $levels,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(ModuleRequest $request)
    {
        $validated = $request->validated();
        Module::create($validated);
        return redirect()->back()->with('success', 'Modul berhasil dibuat');
    }

    public function update(ModuleRequest $request, Module $module)
    {
        $validated = $request->validated();
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

        return Inertia::render('Admin/Builders/AdminContentEditor', [
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
                'status'           => $data['status'] ?? 'published',
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

    public function importKanjiLessons(Request $request, Module $module)
    {
        $validated = $request->validate([
            'jlpt_level' => ['required', 'string', 'max:8'],
            'count' => ['required', 'integer', 'min:1', 'max:50'],
            'status' => ['nullable', 'in:draft,published,all'],
        ]);

        $status = $validated['status'] ?? 'published';
        $query = Kanji::query()
            ->where('jlpt_level', $validated['jlpt_level'])
            ->orderBy('kanji');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $kanjiItems = $query
            ->take($validated['count'])
            ->get();

        if ($kanjiItems->isEmpty()) {
            return redirect()->back()->withErrors([
                'kanji_import' => 'Tidak ada Kanji Bank yang cocok. Sync data dulu atau ubah filter status.',
            ]);
        }

        $nextOrder = (int) $module->lessons()->max('order') + 1;

        DB::transaction(function () use ($module, $kanjiItems, $nextOrder) {
            foreach ($kanjiItems as $index => $kanji) {
                $module->lessons()->create([
                    'title' => "Kanji {$kanji->jlpt_level} - {$kanji->kanji}",
                    'content' => $this->buildKanjiLessonHtml($kanji),
                    'type' => 'text',
                    'order' => $nextOrder + $index,
                    'duration_minutes' => 5,
                    'status' => 'draft',
                ]);
            }
        });

        return redirect()->back()->with('success', $kanjiItems->count() . ' lesson kanji berhasil dibuat sebagai draft.');
    }

    private function buildKanjiLessonHtml(Kanji $kanji): string
    {
        $meaning = e($kanji->indonesian_meaning ?: $kanji->meaning ?: '-');
        $onyomi = e($kanji->onyomi ?: '-');
        $kunyomi = e($kanji->kunyomi ?: '-');
        $exampleWord = e($kanji->example_word ?: '-');
        $exampleReading = e($kanji->example_reading ?: '-');
        $exampleMeaning = e($kanji->example_meaning ?: '-');
        $exampleSentence = e($kanji->example_sentence ?: '-');
        $exampleSentenceReading = e($kanji->example_sentence_reading ?: '-');
        $exampleSentenceMeaning = e($kanji->example_sentence_meaning ?: '-');

        return <<<HTML
<h2 style="font-size: 48px; line-height: 1; margin-bottom: 16px;">{$kanji->kanji}</h2>
<p><strong>JLPT:</strong> {$kanji->jlpt_level}</p>
<p><strong>Arti:</strong> {$meaning}</p>
<p><strong>Onyomi:</strong> {$onyomi}</p>
<p><strong>Kunyomi:</strong> {$kunyomi}</p>
<hr>
<p><strong>Contoh kata:</strong> {$exampleWord}</p>
<p><strong>Reading:</strong> {$exampleReading}</p>
<p><strong>Arti contoh:</strong> {$exampleMeaning}</p>
<p><strong>Contoh kalimat:</strong> {$exampleSentence}</p>
<p><strong>Reading kalimat:</strong> {$exampleSentenceReading}</p>
<p><strong>Arti kalimat:</strong> {$exampleSentenceMeaning}</p>
HTML;
    }
}
