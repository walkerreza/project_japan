<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Quizzes/Index', [
            'quizzes' => Quiz::with('lesson')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'type' => 'required|string|max:50',
        ]);

        Quiz::create($validated);

        return redirect()->back();
    }
}
