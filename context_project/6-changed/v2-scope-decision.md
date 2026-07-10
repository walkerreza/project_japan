# V2 Scope Decision - Japanlingo V2

Tanggal update: 2026-07-10

## Arah V2

`japanlingov2` tidak lagi mengikuti LMS lawas yang lesson/materi-centric. V2 diarahkan menjadi platform belajar N3 berbasis kelas, roadmap mingguan, gamifikasi, payment, dan kloter.

`japanlingo` lawas tetap referensi perilaku dan data, bukan source yang dipindahkan 1:1.

## Scope Utama Aktif

- Auth role `user`, `admin`, dan `superadmin`.
- Kelas/program sebagai entry point user.
- Modul/week mingguan di dalam kelas.
- PPT/presentasi sebagai materi penunjang yang bisa dishare admin ke user.
- Kosakata N3 sebagai library.
- Flashcard sebagai bentuk materi interaktif.
- Kuis sebagai evaluasi dan gate unlock.
- XP, progress, achievement, dan feedback belajar.
- Payment Midtrans.
- Payment scope hybrid: global atau per kelas.
- Access key untuk akses manual/per kloter.
- Kloterisasi user berdasarkan batch/tanggal mulai belajar.
- Notifikasi in-app untuk user/admin/superadmin.

## Scope Yang Dipangkas / Deferred

- Halaman materi panjang sebagai flow utama user.
- Kanji Bank sebagai menu utama.
- Trial 7 hari.
- Redis sebagai kebutuhan wajib.
- PDF final carousel sebagai jalur utama presentasi.
- Import PDF sebagai fitur utama.
- Online document viewer pihak ketiga.
- WhatsApp/push notification.
- Email production tanpa domain.
- Jadwal Zoom.
- Sertifikat final.
- SEO lanjutan.
- OCR/import dokumen berat.
- Full LMS lesson builder seperti web lawas.

## Perubahan dari Catatan Lama

- Leaderboard/pencapaian tidak lagi dipangkas total; tetap dipakai sebagai bagian gamifikasi.
- Presentasi/PPT tidak lagi deferred total; sudah menjadi bagian kelas/week.
- Superadmin tetap dipakai untuk payment, kloter, user, admin, dan operasional.
- Access key bukan flow utama pembayaran, tetapi tetap penting untuk kloter/manual access.
- Notification system tidak lagi dipangkas; in-app notification sudah aktif, email hanya siap konfigurasi.

## Aturan Implementasi

- Jangan menghidupkan kembali `Materi` sebagai halaman utama user.
- Jangan membuat fitur baru yang berat tanpa kebutuhan client yang jelas.
- Jangan menambah tabel jika relasi existing sudah cukup.
- Prioritaskan flow:
  `Kelas -> Roadmap Week -> PPT/Kosakata/Flashcard -> Kuis -> Progress`.
- Jika ada konflik dengan dokumen lama, ikuti `latest-changed.md`.
