<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable) {
            return redirect()->route('login')->withErrors([
                'email' => 'Login Google gagal. Coba lagi atau gunakan email dan password.',
            ]);
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                'google_id' => $user->google_id ?: $googleUser->getId(),
                'auth_provider' => 'google',
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?: now(),
            ]);
        } else {
            $user = User::create([
                'name' => $this->nameFromGoogle($googleUser->getName(), $googleUser->getEmail()),
                'email' => $googleUser->getEmail(),
                'password' => Hash::make(Str::random(40)),
                'role' => 'user',
                'subscription_status' => 'free',
                'auth_provider' => 'google',
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ]);
        }

        if ($user->status === 'suspended') {
            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda telah disuspend.',
            ]);
        }

        Auth::login($user, true);
        request()->session()->regenerate();

        return redirect()->route('dashboard');
    }

    private function nameFromGoogle(?string $name, ?string $email): string
    {
        $fallback = $email ? Str::before($email, '@') : 'google-user';

        return Str::limit(trim($name ?: $fallback), 255, '');
    }
}