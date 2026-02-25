<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    public function storeAttempt(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'score' => 'required|integer',
            'xp_earned' => 'required|integer',
        ]);

        Attempt::create([
            'user_id' => Auth::id(),
            ...$validated,
            'attempted_at' => now(),
        ]);

        return redirect()->back();
    }

    public function completeModule(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
        ]);

        Progress::firstOrCreate([
            'user_id' => Auth::id(),
            'module_id' => $validated['module_id'],
        ], [
            'completed_at' => now(),
        ]);

        return redirect()->back();
    }
}
