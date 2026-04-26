<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLevelController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Levels/AdminLevelsIndex', [
            'levels' => Level::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'level_name' => 'required|string|max:10',
            'stage' => 'required|integer',
        ]);

        Level::create($validated);

        return redirect()->back()->with('success', 'Level berhasil ditambahkan');
    }

    public function update(Request $request, Level $level)
    {
        $validated = $request->validate([
            'level_name' => 'required|string|max:10',
            'stage' => 'required|integer',
        ]);

        $level->update($validated);

        return redirect()->back()->with('success', 'Level berhasil diperbarui');
    }

    public function destroy(Level $level)
    {
        // Pastikan relasi content aman dihapus atau pake cascade, sekarang pakai default
        $level->delete();

        return redirect()->back()->with('success', 'Level berhasil dihapus');
    }
}
