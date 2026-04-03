<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model Pencapaian (Achievement / Lencana)
 *
 * Menyimpan daftar pencapaian yang bisa dibuka oleh user berdasarkan aktivitas belajar.
 * Contoh pencapaian:
 *   - "First Steps"    → selesaikan 1 pelajaran (condition_type: lessons_completed, condition_value: 1)
 *   - "Week Warrior"   → streak 7 hari          (condition_type: streak_days, condition_value: 7)
 *   - "Quiz Master"    → skor 100% di 10 quiz   (condition_type: quiz_perfect, condition_value: 10)
 *
 * Tabel: achievements
 * Relasi:
 *   - belongs to many User (via tabel pivot user_achievements)
 */
class Achievement extends Model
{
    protected $fillable = [
        'name',             // Nama pencapaian (misal: "Quiz Master")
        'description',      // Deskripsi cara mendapatkan pencapaian ini
        'icon',             // Nama icon atau emoji (misal: "🏆" atau "trophy")
        'xp_reward',        // Bonus XP yang diterima saat pencapaian dibuka
        'condition_type',   // Jenis kondisi: lessons_completed | streak_days | quiz_perfect | level_complete
        'condition_value',  // Nilai target kondisi (misal: streak 7 hari → condition_value: 7)
    ];

    /**
     * User-user yang sudah membuka pencapaian ini.
     * Data waktu unlock tersimpan di pivot (unlocked_at).
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }
}
