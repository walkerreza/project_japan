# V2 Scope Decision - Pemangkasan dari Web Lawas

## Alasan Pindah ke V2

Web lawas `japanlingo` sudah membawa terlalu banyak asumsi lama: module/lesson-centric, builder materi kompleks, payment manual/access key, superadmin lengkap, certificate/news/theme, dan presentation/board yang melebar.

Scope client terbaru lebih cocok dibangun ulang sebagai backend yang lebih ramping, dengan fokus utama pada quiz-first learning flow, flashcard/kosakata, QRIS gateway, dan kloter/classroom.

## Patokan Request Client Terbaru

- Materi dari Drive dipakai untuk digamifikasi, bukan menjadi halaman materi panjang.
- Fitur materi/module dipending dulu.
- Flashcard dipakai untuk kanji dan kosakata, tetapi library yang diminta cukup kosakata dulu.
- Flashcard/kosakata harus nyambung ke game/kuis.
- Presentasi cukup diedit admin, user hanya melihat.
- Presentasi perlu fitur share, tetapi versi lengkap presentation/board tidak harus masuk v2 awal.
- Payment diarahkan ke dalam negeri dan QRIS.
- SEO tidak diprioritaskan.
- Non-premium hanya mendapat preview materi/konten yang tidak lengkap.
- Admin kemungkinan perlu kloterisasi user, detail masih menyusul.

## Scope Utama V2

- Quiz-first learning flow.
- Flashcard/kosakata sebagai materi utama yang nyambung ke kuis/game.
- Progress, XP, feedback jawaban, dan unlock setelah lulus.
- QRIS payment gateway otomatis.
- Premium/free access berbasis akses konten, quiz, pack, atau kelas, bukan halaman materi panjang.
- Admin quiz/question/vocabulary management.
- Import soal/kosakata CSV/XLSX jika masih dibutuhkan admin.
- Kloter/classroom untuk admin, detail menyusul.

## Fitur Lawas yang Dipangkas atau Ditunda

- Halaman materi panjang.
- Module/lesson builder kompleks.
- Import dokumen materi.
- Manual payment/access key sebagai flow utama.
- Certificate.
- Leaderboard.
- News portal lengkap.
- Superadmin system/theme global.
- Activity/login history detail.
- Google OAuth.
- Notification system.
- Kanji bank penuh.
- Presentation/board versi lengkap.
- SEO lanjutan.
- OCR/import PDF/PPT gambar.

## Fitur Lawas yang Masih Layak Dibawa

- Auth role `user`, `admin`, dan `superadmin`.
- Quiz, questions, attempts, attempt_answers.
- Scoring server-side.
- XP/progress.
- Flashcard + vocabulary library.
- Admin quiz/question management.
- Premium/free access, tetapi disesuaikan dengan QRIS gateway dan scope v2.

## Catatan Implementasi

- `japanlingo` lawas tetap dipakai sebagai referensi perilaku dan schema, bukan dipindahkan 1:1.
- V2 jangan dimulai dari porting semua fitur lawas.
- Prioritas backend v2 adalah domain yang langsung mendukung demo/beta: auth role, quiz, flashcard/kosakata, progress/XP, payment QRIS, dan admin minimal.
- Fitur yang tidak dikunci oleh chat terbaru masuk backlog sampai client mengonfirmasi ulang.
