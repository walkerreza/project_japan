<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Attempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * QuizAttemptController (User)
 *
 * Menangani pengiriman jawaban quiz oleh user, menghitung skor,
 * memberikan XP sesuai performa, dan menyimpan riwayat percobaan.
 *
 * Alur kerja:
 *   1. User mengerjakan quiz di halaman Quiz.jsx
 *   2. Setelah selesai, frontend mengirim POST request ke sini
 *   3. Controller hitung XP berdasarkan skor
 *   4. XP ditambahkan ke kolom `xp` di tabel users
 *   5. Attempt disimpan ke tabel `attempts`
 *
 * Skema pemberian XP:
 *   - Skor ≥ 80% → +50 XP (Excellent)
 *   - Skor ≥ 60% → +30 XP (Good)
 *   - Skor < 60%  → +10 XP (Keep trying!)
 *
 * Route: POST /user/quiz-attempts (didaftarkan di routes/web.php)
 */
class QuizAttemptController extends Controller
{
    /**
     * Terima hasil quiz dari frontend, hitung XP, dan simpan ke database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id', // Quiz yang dikerjakan harus ada di database
            'score'   => 'required|integer|min:0|max:100', // Skor dalam persentase (0-100)
        ]);

        $user = Auth::user();

        // Tentukan XP yang diperoleh berdasarkan rentang skor
        $xpEarned = match(true) {
            $validated['score'] >= 80 => 50, // Excellent
            $validated['score'] >= 60 => 30, // Good
            default                   => 10, // Keep trying
        };

        // Simpan riwayat percobaan quiz ke tabel attempts
        Attempt::create([
            'user_id'      => $user->id,
            'quiz_id'      => $validated['quiz_id'],
            'score'        => $validated['score'],
            'xp_earned'    => $xpEarned,
            'attempted_at' => now(),
        ]);

        // Tambahkan XP ke akun user
        $user->increment('xp', $xpEarned);

        return redirect()->back()->with('success', "Quiz selesai! +{$xpEarned} XP");
    }
}
