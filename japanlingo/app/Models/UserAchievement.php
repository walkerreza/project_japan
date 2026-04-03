<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model Pivot: Pencapaian User
 *
 * Menjembatani relasi many-to-many antara User dan Achievement.
 * Setiap baris = satu user yang sudah membuka satu pencapaian tertentu.
 *
 * Tabel: user_achievements
 * Unique constraint: kombinasi (user_id, achievement_id) tidak boleh duplikat.
 */
class UserAchievement extends Model
{
    protected $fillable = [
        'user_id',        // ID user yang mendapat pencapaian
        'achievement_id', // ID pencapaian yang dibuka
        'unlocked_at',    // Waktu pencapaian berhasil dibuka
    ];

    protected $casts = [
        'unlocked_at' => 'datetime',
    ];

    /**
     * User pemilik pencapaian ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Detail pencapaian yang dibuka
     */
    public function achievement()
    {
        return $this->belongsTo(Achievement::class);
    }
}
