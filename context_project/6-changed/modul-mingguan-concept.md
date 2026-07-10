# Konsep Aktif: Kelas dan Modul Mingguan Terpadu

Tanggal update: 2026-07-10

## Ringkasan

Client mengarah ke pengalaman belajar seperti Duolingo/Quizizz/Riki Jepang: user memilih kelas, masuk ke roadmap mingguan, lalu belajar lewat PPT, kosakata, flashcard, dan kuis yang saling terhubung.

Istilah aktif:

- **Kelas / Program**: pintu masuk utama user, misalnya kelas JLPT N3.
- **Modul / Week**: satu unit mingguan di dalam kelas.
- **Materi**: tidak lagi halaman baca panjang; materi diwujudkan sebagai PPT, kosakata, dan flashcard.
- **Kuis**: evaluasi untuk membuka progres berikutnya.

## Flow User Aktif

```text
Dashboard / Sidebar
-> Kelas
-> pilih kelas
-> Roadmap mingguan
-> PPT / Kosakata / Flashcard
-> Kuis
-> Feedback, XP, progress
-> unlock Week berikutnya jika lulus
```

## Aturan Unlock

- Week 1 menjadi preview gratis.
- Week premium berikutnya butuh akses aktif: payment atau access key.
- Jika user punya kloter, week juga mengikuti minggu aktif kloter.
- Flashcard harus selesai sebelum kuis.
- Kuis dianggap lulus jika skor memenuhi `passing_score`, semua soal dijawab, tidak timeout, dan tidak habis nyawa.
- Progress modul hanya `completed_at` jika kuis lulus.
- Gagal kuis tidak membuat notifikasi unlock dan tidak membuka week berikutnya.

## Isi Satu Week

Setiap week dapat berisi:

- PPT / presentasi dari admin.
- Kosakata N3.
- Flashcard sebagai materi sela-sela.
- Kuis sebagai evaluasi.

Konten tidak wajib semuanya ada, tetapi week ideal berisi minimal flashcard dan kuis.

## Admin

Admin tetap mengelola komponen secara terpisah:

- Kelas/program.
- Modul/week.
- PPT/presentasi.
- Kosakata.
- Flashcard.
- Kuis.

Komponen tersebut dihubungkan ke modul/week yang sama agar tampil menyatu di roadmap user.

## Yang Sudah Tidak Menjadi Patokan

- `LessonPage.jsx` orchestrator lama tidak menjadi syarat utama.
- `DaftarMateri` bukan entry user.
- Halaman materi panjang tidak dipakai sebagai flow utama.
- Kuis dan flashcard tidak digabung menjadi satu tabel; tetap tabel terpisah.
- Daftar kuis/flashcard mandiri bukan entry utama user, hanya boleh ada sebagai fallback/deferred.

## Status Implementasi

- Kelas sebagai entry point user: sudah.
- Roadmap mingguan: sudah.
- PPT ke user: sudah.
- Kosakata ke user: sudah.
- Flashcard ke user: sudah.
- Kuis ke user: sudah.
- Passing score dan unlock berbasis lulus: sudah.
- Kloter membatasi minggu aktif: sudah.
- UI polish dan QA penuh: masih lanjut.
