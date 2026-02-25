<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LevelController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Levels/Index', [
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

        return redirect()->back();
    }
}
