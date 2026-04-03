<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model Sertifikat
 *
 * Merepresentasikan sertifikat yang diterima user setelah menyelesaikan satu level JLPT.
 * Contoh: Setelah menyelesaikan semua module N5, user mendapat sertifikat N5.
 *
 * Tabel: certificates
 * Relasi:
 *   - belongs to User  (siapa yang mendapat sertifikat)
 *   - belongs to Level (sertifikat untuk level apa: N5/N4/N3/N2/N1)
 */
class Certificate extends Model
{
    protected $fillable = [
        'user_id',           // ID pemilik sertifikat
        'level_id',          // Sertifikat untuk level JLPT apa
        'issued_at',         // Tanggal sertifikat diterbitkan
        'certificate_number',// Nomor unik sertifikat (contoh: CERT-2026-00012)
        'file_path',         // Path file PDF di storage
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    /**
     * User pemilik sertifikat ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Level JLPT yang sudah diselesaikan (yang menjadi dasar penerbitan sertifikat)
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
