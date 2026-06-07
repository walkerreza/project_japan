<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ModuleRequest;
use App\Models\Level;
use App\Models\Module;
use App\Services\ExcelTemplateService;
use App\Services\LessonContentService;
use App\Services\LessonDocumentService;
use App\Services\SpreadsheetImportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminModuleController extends Controller
{
    public function index(Request $request)
    {
        $query = Module::with('level')
            ->withCount('lessons')
            ->orderBy('level_id')
            ->orderBy('week_number');

        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        $modules = $query->paginate(10)->through(fn ($module) => [
            'id' => $module->id,
            'title' => $module->title,
            'description' => $module->description,
            'week_number' => $module->week_number,
            'status' => $module->status ?? 'published',
            'level' => $module->level,
            'lesson_count' => $module->lessons_count,
        ]);

        return Inertia::render('Admin/ModulMateri/ManajemenModulMateri', [
            'modules' => $modules,
            'levels' => Level::orderBy('stage')->get(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(ModuleRequest $request)
    {
        Module::create($request->validated());

        return redirect()->back()->with('success', 'Modul berhasil dibuat');
    }

    public function update(ModuleRequest $request, Module $module)
    {
        $module->update($request->validated());

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
        $module->load(['level', 'lessons' => fn ($query) => $query->orderBy('order')]);

        return Inertia::render('Admin/ModulMateri/BuilderMateri', [
            'module' => $module,
            'lessons' => $module->lessons,
        ]);
    }

    public function updateContent(Request $request, Module $module, LessonDocumentService $documents)
    {
        $lessonsData = $request->input('lessons', []);
        $lessonsFiles = $request->file('lessons', []);
        $existingLessons = $module->lessons()->get()->keyBy('id');
        $lessonIds = [];

        foreach ($request->input('deleted_files', []) as $path) {
            $documents->delete($path);
        }

        foreach ($lessonsData as $index => $data) {
            $existingLesson = $existingLessons->get($data['id'] ?? null);
            $updateData = [
                'title' => $data['title'] ?? 'Untitled',
                'content' => $data['content'] ?? '',
                'type' => $data['type'] ?? 'text',
                'video_url' => $data['video_url'] ?? null,
                'order' => $index,
                'duration_minutes' => $data['duration_minutes'] ?? 5,
                'status' => $data['status'] ?? 'published',
            ];

            $uploadedFile = $lessonsFiles[$index]['file_uploaded'] ?? null;

            if ($uploadedFile) {
                if ($existingLesson?->file_url) {
                    $documents->delete($existingLesson->file_url);
                }

                $updateData['file_url'] = $uploadedFile->store('lessons', 'public');
            } else {
                $updateData['file_url'] = $data['file_url'] ?? null;

                if ($existingLesson?->file_url && empty($updateData['file_url'])) {
                    $documents->delete($existingLesson->file_url);
                }
            }

            $lesson = $module->lessons()->updateOrCreate(
                ['id' => $data['id'] ?? null],
                $updateData
            );

            $lessonIds[] = $lesson->id;
        }

        $lessonsToDelete = empty($lessonIds)
            ? $module->lessons()->get()
            : $module->lessons()->whereNotIn('id', $lessonIds)->get();

        foreach ($lessonsToDelete as $lessonToDelete) {
            $documents->delete($lessonToDelete->file_url);
            $lessonToDelete->delete();
        }

        return redirect()->back()->with('success', 'Konten modul berhasil disimpan');
    }

    public function importKanjiLessons(Request $request, Module $module, LessonContentService $lessons)
    {
        $validated = $request->validate([
            'jlpt_level' => ['required', 'string', 'max:8'],
            'count' => ['required', 'integer', 'min:1', 'max:50'],
            'status' => ['nullable', 'in:draft,published,all'],
        ]);

        $created = $lessons->createKanjiLessons($module, $validated);

        if ($created === 0) {
            return redirect()->back()->withErrors([
                'kanji_import' => 'Tidak ada Kanji Bank yang cocok. Sync data dulu atau ubah filter status.',
            ]);
        }

        return redirect()->back()->with('success', $created . ' lesson kanji berhasil dibuat sebagai draft.');
    }

    public function importDocument(Request $request, Module $module, LessonDocumentService $documents)
    {
        $validated = $request->validate([
            'document' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:20480'],
        ]);

        return response()->json($documents->upload($validated['document']));
    }

    public function importLessons(
        Request $request,
        Module $module,
        SpreadsheetImportService $spreadsheets,
        LessonContentService $lessons
    ) {
        $validated = $request->validate([
            'import_file' => ['required', 'file', 'max:4096'],
        ]);

        $file = $validated['import_file'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, ['csv', 'txt', 'xlsx'], true)) {
            return redirect()->back()->withErrors([
                'lesson_import' => 'Format import harus CSV atau XLSX.',
            ]);
        }

        $rows = $spreadsheets->rows($file->getRealPath(), $extension);

        if (empty($rows)) {
            return redirect()->back()->withErrors([
                'lesson_import' => 'Tidak ada baris materi yang valid atau header tidak sesuai.',
            ]);
        }

        $created = $lessons->importRows($module, $rows);

        if ($created === 0) {
            return redirect()->back()->withErrors([
                'lesson_import' => 'Tidak ada materi valid. Pastikan kolom lesson_title terisi.',
            ]);
        }

        return redirect()->back()->with('success', "{$created} materi berhasil diimport sebagai draft/review.");
    }

    public function downloadLessonImportTemplate(
        Module $module,
        string $format,
        ExcelTemplateService $templates,
        LessonContentService $lessons
    ) {
        $format = strtolower($format);

        if (! in_array($format, ['csv', 'xlsx'], true)) {
            abort(404);
        }

        $headers = [
            'lesson_title',
            'lesson_type',
            'content',
            'video_url',
            'file_url',
            'duration_minutes',
            'status',
            'order',
        ];
        $rows = $lessons->templateRows();
        $filename = 'japanlingo-lesson-import-template-v1.' . $format;

        if ($format === 'csv') {
            return $templates->csvResponse($headers, $rows, $filename);
        }

        $path = $templates->xlsxPath($headers, $rows, 'Lesson Import', 'japanlingo_lesson_template_');

        return response()
            ->download($path, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend(true);
    }
}
