# Latest Changed - Japanlingo V2

Tanggal update: 2026-07-10

## Sumber Kebenaran Aktif

Dokumen ini menjadi ringkasan konteks aktif terbaru untuk `japanlingov2`. Jika ada konflik dengan catatan lama, ikuti dokumen ini dulu.

Referensi aktif:

- `context_project/6-changed/modul-mingguan-concept.md`
- `context_project/6-changed/hybrid-payment-access-scope-2026-07-06.md`
- `context_project/6-changed/kloter-payment-access-2026-07-09.md`
- `context_project/Chat WhatsApp dengan Fuad (Jepang) baru/`

## Keputusan Produk Terbaru

- Halaman utama user adalah `Kelas`, bukan daftar materi terpisah.
- Satu kelas/program berisi roadmap mingguan.
- Satu week/modul berisi PPT/presentasi, kosakata, flashcard, dan kuis.
- Materi panjang dipending/hidden; materi utama sekarang berbentuk PPT, kosakata, flashcard, dan kuis.
- Flashcard harus selesai sebelum kuis.
- Week berikutnya unlock hanya jika kuis lulus sesuai `passing_score`.
- Preview gratis hanya Week 1, bukan trial 7 hari.
- Payment memakai Midtrans; scope dibuat hybrid: bisa global atau per kelas/program.
- Access key bisa membuka akses kelas/kloter dan bisa dipakai banyak user sesuai `max_uses`.
- Kloter mengatur batch belajar, tanggal mulai, minggu aktif, kapasitas, dan roster user.
- Notifikasi in-app aktif untuk user/admin/superadmin; email disiapkan tetapi default nonaktif.

## Sudah Diimplementasikan / Dipakai

- Kelas sebagai entry point user.
- Roadmap mingguan per kelas.
- PPT/presentasi dari admin ke user.
- Kosakata library.
- Flashcard builder dan latihan user.
- Kuis builder dan pengerjaan user.
- Repetisi kuis/flashcard.
- Passing score kuis.
- Progress hanya completed jika kuis lulus.
- Midtrans checkout dan sync status.
- Hybrid payment global/per kelas.
- Access key global/per kelas/kloter.
- Kloter superadmin, assign user, kapasitas, dan auto-assign dari payment/access key.
- Bell notification untuk semua role.
- Email notification hanya siap konfigurasi, belum aktif default.

## Deferred / Tidak Jadi Patokan Utama Sekarang

- Halaman materi panjang user.
- Builder materi lama sebagai pusat pembelajaran.
- Kanji Bank sebagai menu utama.
- Trial 7 hari.
- Redis sebagai kebutuhan wajib.
- PDF carousel untuk presentasi.
- Import PDF final sebagai jalur utama presentasi.
- Online document viewer pihak ketiga.
- Google/Microsoft document viewer untuk file lokal/privat.
- WhatsApp/push notification.
- Email production tanpa domain; untuk sekarang cukup in-app atau Gmail sementara jika benar-benar perlu.
- Jadwal Zoom.
- Sertifikat final, masih dipikirkan nanti.
- Mass Excel input semua modul, masih backlog setelah flow inti stabil.

## Catatan Implementasi Penting

- Target aktif adalah `japanlingov2`; folder `japanlingo` lawas hanya referensi.
- Database aktif MySQL.
- Jangan menghidupkan kembali route/page materi lama sebagai flow utama user.
- Jangan membuat tabel baru jika fitur bisa memakai tabel yang sudah ada dengan relasi jelas.
- Untuk notifikasi email, aktifkan hanya di env production jika SMTP valid:
  `MAIL_NOTIFICATIONS_ENABLED=true`.
