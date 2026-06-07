<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kanji;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminKanjiController extends Controller
{
    public function index(Request $request)
    {
        $query = Kanji::query()->latest();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($query) use ($search) {
                $query->where('kanji', 'like', "%{$search}%")
                    ->orWhere('onyomi', 'like', "%{$search}%")
                    ->orWhere('kunyomi', 'like', "%{$search}%")
                    ->orWhere('meaning', 'like', "%{$search}%")
                    ->orWhere('indonesian_meaning', 'like', "%{$search}%")
                    ->orWhere('example_word', 'like', "%{$search}%")
                    ->orWhere('example_reading', 'like', "%{$search}%")
                    ->orWhere('example_meaning', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('jlpt_level') && $request->jlpt_level !== 'all') {
            $query->where('jlpt_level', $request->jlpt_level);
        }

        return Inertia::render('Admin/KanjiBank/KanjiBank', [
            'kanji' => $query->paginate(12)->withQueryString(),
            'filters' => $request->only('search', 'status', 'jlpt_level'),
        ]);
    }

    public function store(Request $request)
    {
        Kanji::create($this->validateKanji($request));

        return redirect()->back()->with('success', 'Kanji berhasil ditambahkan.');
    }

    public function update(Request $request, Kanji $kanji)
    {
        $kanji->update($this->validateKanji($request, $kanji));

        return redirect()->back()->with('success', 'Kanji berhasil diperbarui.');
    }

    public function destroy(Kanji $kanji)
    {
        $kanji->delete();

        return redirect()->back()->with('success', 'Kanji berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'import_file' => ['required', 'file', 'max:2048'],
        ]);

        $extension = strtolower($validated['import_file']->getClientOriginalExtension());

        if (! in_array($extension, ['csv', 'txt'], true)) {
            return redirect()->back()->withErrors(['import_file' => 'Gunakan CSV untuk import Kanji Bank.']);
        }

        $handle = fopen($validated['import_file']->getRealPath(), 'r');

        if (! $handle) {
            return redirect()->back()->withErrors(['import_file' => 'File tidak dapat dibaca.']);
        }

        $header = fgetcsv($handle);

        if (! $header) {
            fclose($handle);
            return redirect()->back()->withErrors(['import_file' => 'CSV kosong atau header tidak valid.']);
        }

        $headers = array_map(fn ($value) => str($value)->lower()->replace(' ', '_')->toString(), $header);
        $created = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($headers, array_slice(array_pad($row, count($headers), null), 0, count($headers)));
            $kanjiChar = trim((string) ($data['kanji'] ?? ''));

            if ($kanjiChar === '') {
                continue;
            }

            Kanji::updateOrCreate(
                ['kanji' => $kanjiChar],
                [
                    'onyomi' => $data['onyomi'] ?? null,
                    'kunyomi' => $data['kunyomi'] ?? null,
                    'meaning' => $data['meaning'] ?? null,
                    'indonesian_meaning' => $data['indonesian_meaning'] ?? $data['arti_indonesia'] ?? null,
                    'jlpt_level' => $data['jlpt_level'] ?? 'N3',
                    'stroke_count' => $data['stroke_count'] ?? null,
                    'tags' => ! empty($data['tags']) ? preg_split('/\s*\|\s*/', $data['tags']) : null,
                    'example_word' => $data['example_word'] ?? null,
                    'example_reading' => $data['example_reading'] ?? null,
                    'example_meaning' => $data['example_meaning'] ?? null,
                    'status' => $data['status'] ?? 'draft',
                ]
            );

            $created++;
        }

        fclose($handle);

        return redirect()->back()->with('success', "{$created} kanji berhasil diimport.");
    }

    public function autofill(Request $request)
    {
        $validated = $request->validate([
            'kanji' => ['required', 'string', 'max:8'],
        ]);

        try {
            $response = Http::timeout(8)->get('https://kanjiapi.dev/v1/kanji/' . urlencode($validated['kanji']));

            if (! $response->successful()) {
                return response()->json(['message' => 'Data kanji tidak ditemukan.'], 404);
            }

            $payload = $response->json();

            return response()->json([
                'kanji' => $payload['kanji'] ?? $validated['kanji'],
                'onyomi' => implode(', ', $payload['on_readings'] ?? []),
                'kunyomi' => implode(', ', $payload['kun_readings'] ?? []),
                'meaning' => implode(', ', $payload['meanings'] ?? []),
                'jlpt_level' => isset($payload['jlpt']) ? 'N' . $payload['jlpt'] : 'N3',
                'stroke_count' => $payload['stroke_count'] ?? null,
            ]);
        } catch (\Throwable) {
            return response()->json(['message' => 'Auto-fill gagal. Isi manual atau coba lagi nanti.'], 422);
        }
    }

    private function validateKanji(Request $request, ?Kanji $kanji = null): array
    {
        return $request->validate([
            'kanji' => ['required', 'string', 'max:8', Rule::unique('kanji_bank', 'kanji')->ignore($kanji?->id)],
            'onyomi' => ['nullable', 'string'],
            'kunyomi' => ['nullable', 'string'],
            'meaning' => ['nullable', 'string'],
            'indonesian_meaning' => ['nullable', 'string'],
            'jlpt_level' => ['required', 'string', 'max:8'],
            'stroke_count' => ['nullable', 'integer', 'min:1', 'max:99'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['nullable', 'string', 'max:50'],
            'example_word' => ['nullable', 'string', 'max:255'],
            'example_reading' => ['nullable', 'string', 'max:255'],
            'example_meaning' => ['nullable', 'string'],
            'example_sentence' => ['nullable', 'string'],
            'example_sentence_reading' => ['nullable', 'string'],
            'example_sentence_meaning' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published'],
        ]);
    }
}
