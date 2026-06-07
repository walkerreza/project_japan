<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('landingPage');
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function pricing()
    {
        return Inertia::render('Pricing');
    }

    public function roadmap()
    {
        return Inertia::render('Roadmap');
    }

    public function userProfile()
    {
        return Inertia::render('User/Profil');
    }

    public function adminProfile()
    {
        return Inertia::render('Admin/Profil');
    }

    public function superAdminProfile()
    {
        return Inertia::render('SuperAdmin/Profil');
    }
}
