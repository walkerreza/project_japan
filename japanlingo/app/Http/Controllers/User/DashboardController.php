<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('User/UserDashboard', [
            'user' => $user,
            'recentProgress' => $user->progress()->with('module')->latest()->take(5)->get(),
            'availableLevels' => Level::with('modules')->get(),
        ]);
    }
}
