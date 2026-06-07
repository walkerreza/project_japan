# JapanLingo QA Checklist

Checklist ini dipakai sebelum menambah fitur besar baru. Tujuannya memastikan flow user, admin, dan superadmin benar-benar jalan di browser.

## Persiapan

- [ ] Jalankan server Laravel development.
- [ ] Jalankan Vite development.
- [ ] Jalankan migration jika perlu: `php artisan migrate`.
- [ ] Jalankan demo data jika perlu: `php artisan db:seed`.
- [ ] Superadmin login: `superadmin@japanlingo.com` / `password`.
- [ ] Admin login: `admin@japanlingo.com` / `password`.
- [ ] Premium user login: `student@japanlingo.com` / `password`.
- [ ] Free user login: `student2@japanlingo.com` / `password`.
- [ ] Demo access key: `DEMO-N3-PREMIUM`.

## Auth & Role

- [ ] Guest bisa membuka landing page.
- [ ] Guest bisa membuka pricing, about, roadmap.
- [ ] Login manual berhasil.
- [ ] Register user baru berhasil dan role default adalah `user`.
- [ ] Google login tidak 403 jika env Google valid.
- [ ] Superadmin diarahkan ke `/superadmin/dashboard`.
- [ ] Admin diarahkan ke `/admin/dashboard`.
- [ ] User diarahkan ke `/user/dashboard`.
- [ ] User tidak bisa membuka route admin/superadmin.
- [ ] Admin tidak bisa membuka route superadmin.

## User/Siswa

- [ ] Dashboard user tampil tanpa error.
- [ ] News card tampil jika ada berita published.
- [ ] Klik berita mengarah ke halaman detail berita.
- [ ] Daftar materi tampil.
- [ ] Detail materi text/html tampil.
- [ ] File lesson PDF/DOC/PPT tidak membuat page crash.
- [ ] Daftar kuis tampil.
- [ ] User bisa membuka kuis.
- [ ] User bisa submit kuis.
- [ ] Score dan XP tercatat.
- [ ] Progress lesson tercatat.
- [ ] Leaderboard tampil.
- [ ] Sertifikat page tampil.
- [ ] User free yang membuka premium content mendapat blocked/upgrade state yang jelas.
- [ ] Redeem `DEMO-N3-PREMIUM` pada user free berhasil.
- [ ] Setelah redeem, user free bisa membuka konten premium.

## Admin/Sensei

- [ ] Dashboard admin tampil.
- [ ] Data user tampil dan detail user bisa dibuka.
- [ ] Analitik tampil, termasuk question performance jika ada attempt answer.
- [ ] Level management bisa create/update/delete sesuai kebutuhan.
- [ ] Manajemen Modul & Materi tampil.
- [ ] Admin bisa membuat module.
- [ ] Admin bisa edit module.
- [ ] Admin bisa membuka Builder Materi.
- [ ] Admin bisa menambah lesson text.
- [ ] Admin bisa hapus lesson dengan validasi.
- [ ] Admin bisa import lesson CSV/XLSX dari template.
- [ ] Admin bisa import dokumen lesson tanpa page crash.
- [ ] Admin bisa import/generate draft lesson dari Kanji Bank.
- [ ] Manajemen Kuis tampil.
- [ ] Admin bisa membuat quiz.
- [ ] Admin bisa membuka Builder Kuis.
- [ ] Admin bisa tambah/edit/hapus soal.
- [ ] Admin bisa download template import soal.
- [ ] Admin bisa import soal CSV/XLSX.
- [ ] Admin bisa generate soal dari Kanji Bank.
- [ ] Kanji Bank bisa search, create, edit, delete.
- [ ] Gamifikasi admin bisa kelola achievement.

## Superadmin

- [ ] Dashboard superadmin tampil.
- [ ] Data user tampil dan bisa update status.
- [ ] Data admin tampil dan bisa tambah admin.
- [ ] Reset password user/admin tidak error.
- [ ] Konten/news tampil.
- [ ] Superadmin bisa create news.
- [ ] Superadmin bisa edit news.
- [ ] Superadmin bisa delete news.
- [ ] Upload gambar editor news tidak menutup sidebar/content.
- [ ] News published muncul di user dashboard/news.
- [ ] Pemasukan tampil.
- [ ] Payment plan bisa dibuat.
- [ ] Transaction manual bisa dibuat.
- [ ] Transaction bisa approve/reject.
- [ ] Access key bisa dibuat.
- [ ] Access key bisa revoke.
- [ ] Sistem/theme tampil.
- [ ] Update global theme tersimpan di `app_settings`.
- [ ] Aktivitas tampil.

## Regression UI

- [ ] Admin pages tidak tertutup sidebar di desktop.
- [ ] Superadmin content/news editor tidak tertutup sidebar.
- [ ] Builder materi responsif di mobile/tablet/desktop.
- [ ] Builder kuis responsif di mobile/tablet/desktop.
- [ ] Dark mode tidak membuat teks hilang di Modul/Materi dan Kuis.
- [ ] Tidak ada warning React duplicate key yang terlihat berulang.
- [ ] Tidak ada crash React Quill saat tambah/hapus item builder.

## Catatan Keputusan

- OCR/import massal file gambar masih pending.
- Payment gateway real belum diaktifkan; flow sekarang manual premium/access key.
- Database table tetap English; frontend page memakai nama Indonesia.
