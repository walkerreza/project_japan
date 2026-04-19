<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = Achievement::withCount('users')->orderBy('created_at', 'desc')->get();

        return response()->json($achievements);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
            'xp_reward' => 'required|integer|min:0',
            'condition_type' => 'required|in:lessons_completed,quiz_perfect,streak_days',
            'condition_value' => 'required|integer|min:1',
        ]);

        Achievement::create($validated);

        return back()->with('success', 'Lencana berhasil ditambahkan.');
    }

    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
            'xp_reward' => 'required|integer|min:0',
            'condition_type' => 'required|in:lessons_completed,quiz_perfect,streak_days',
            'condition_value' => 'required|integer|min:1',
        ]);

        $achievement->update($validated);

        return back()->with('success', 'Lencana berhasil diperbarui.');
    }

    public function destroy(Achievement $achievement)
    {
        $achievement->delete();

        return back()->with('success', 'Lencana berhasil dihapus.');
    }
}
