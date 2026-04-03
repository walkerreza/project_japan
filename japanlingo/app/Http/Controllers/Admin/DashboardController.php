<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'totalModules'   => Module::count(),
            'totalLessons'   => Lesson::count(),
            'totalQuizzes'   => Quiz::count(),
            'totalQuestions' => Question::count(),
            'totalUsers'     => User::where('role', 'user')->count(),
            'activeUsers'    => User::where('role', 'user')->count(), // placeholder, bisa dikembangkan
        ]);
    }
}
