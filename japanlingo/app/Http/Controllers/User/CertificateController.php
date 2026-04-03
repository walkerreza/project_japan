<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * CertificateController (User)
 *
 * Mengelola sertifikat yang dimiliki user.
 * Sertifikat diterbitkan otomatis oleh sistem saat user menyelesaikan seluruh
 * module dalam satu level JLPT (N5 → N4 → N3 → N2 → N1).
 *
 * Fitur:
 *   - index()    : Tampilkan semua sertifikat milik user yang sedang login
 *   - download() : Download file PDF sertifikat (hanya pemilik yang bisa)
 *
 * Route:
 *   GET  /user/certificates          → index()
 *   GET  /user/certificates/{id}/download → download()
 *
 * Halaman React terkait: resources/js/Pages/User/Certificate.jsx
 *
 * CATATAN untuk pengembang:
 *   File PDF sertifikat disimpan di storage/app/certificates/
 *   Generate PDF menggunakan library (misal: barryvdh/laravel-dompdf) — belum diimplementasi.
 */
class CertificateController extends Controller
{
    /**
     * Tampilkan daftar sertifikat milik user yang sedang login.
     * Data level (N5/N4/dst) ikut di-load via eager loading.
     */
    public function index()
    {
        $certificates = Auth::user()
            ->certificates()
            ->with('level')           // Sertakan data level (nama: N5, N4, dll)
            ->orderByDesc('issued_at') // Terbaru ditampilkan pertama
            ->get();

        return Inertia::render('User/Certificate', [
            'certificates' => $certificates,
        ]);
    }

    /**
     * Download file PDF sertifikat.
     *
     * PENTING: Dilindungi dengan pengecekan kepemilikan (abort 403 jika bukan pemilik).
     * Ini mencegah user A mengakses sertifikat milik user B.
     *
     * @param  \App\Models\Certificate  $certificate
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download(Certificate $certificate)
    {
        // Keamanan: pastikan hanya pemilik sertifikat yang bisa download
        abort_if($certificate->user_id !== Auth::id(), 403, 'Akses ditolak.');

        // Cek apakah file PDF sudah di-generate dan ada di storage
        if ($certificate->file_path && Storage::exists($certificate->file_path)) {
            return Storage::download(
                $certificate->file_path,
                "sertifikat-{$certificate->certificate_number}.pdf"
            );
        }

        return redirect()->back()->with('error', 'File sertifikat belum tersedia atau tidak ditemukan.');
    }
}
