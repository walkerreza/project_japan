# Frontend Scope Audit V2

Tanggal audit: 2026-06-29

## Kesimpulan

Frontend `japanlingov2/resources` belum sepenuhnya sesuai sebagai target final v2. Kondisinya masih banyak membawa frontend lawas, sehingga fitur inti sudah ada tetapi fitur pending/deferred juga masih tampil sebagai fitur aktif.

Patokan v2 dari `context_project`:

- Flow utama user: `Beranda -> Flashcard/Kosakata -> Kuis -> Progress -> Upgrade`.
- Materi/module bukan pusat experience fase beta.
- Materi/module builder kompleks dipending dulu.
- Flashcard/kosakata dan kuis adalah fitur inti.
- Payment diarahkan ke QRIS/premium access, bukan manual/access key sebagai flow utama jangka panjang.
- Presentation/board lengkap, leaderboard, sertifikat, kanji bank penuh, berita/konten, dan sistem/theme global masuk backlog/deferred kecuali client mengunci ulang.

## Sudah Selaras

- Auth dan role user/admin/superadmin sudah ada.
- Dashboard user, kuis user, flashcard user, progress, dan pricing sudah tersedia.
- Admin kuis/soal, flashcard, kosakata, data murid, dan analitik sudah tersedia.
- Superadmin user, admin, dan pemasukan/payment sudah tersedia.
- Build frontend berhasil dengan `npm run build`.
- Referensi `route('...')` di React tidak ditemukan mismatch terhadap route backend.

## Belum Selaras / Perlu Dipangkas

- Menu user masih menampilkan `Pelajaran`, `Peringkat`, dan `Sertifikat`.
- Admin masih menampilkan `Modul`, `Presentasi`, `Kanji Bank`, dan `Aturan Gim` sebagai menu aktif.
- Superadmin masih menampilkan `Konten`, `Gamifikasi`, `Aktivitas`, dan `Sistem` sebagai menu aktif.
- `Admin/ModulMateri/*` masih berupa builder materi/modul penuh, padahal materi/module dipending.
- `Admin/Presentasi/*` dan `Admin/BoardAjar/*` masih aktif seperti fitur penuh.
- `Admin/KanjiBank/*` masih aktif, sementara prioritas beta adalah kosakata.
- Payment frontend masih dominan manual/access key di superadmin; QRIS belum menjadi alur utama yang jelas.

## Temuan Teknis

- Backend merender halaman user ke `Pages/Pengguna/*`.
- Folder `Pages/User/*` masih ada dan terlihat sebagai duplikasi sisa frontend lawas.
- Ada target render yang hilang:
  - `Admin/LevelPembelajaran/ManajemenLevel`
  - sumber: `japanlingov2/app/Http/Controllers/Admin/AdminLevelController.php`
- File yang tersedia untuk level saat audit:
  - `Pages/Admin/Level/ManajemenLevel.jsx`
  - `Pages/Admin/ManajemenLevel.jsx`

## Rekomendasi Tahap Berikutnya

1. Tetapkan `Pages/Pengguna/*` sebagai folder aktif untuk user, lalu hapus atau arsipkan `Pages/User/*` setelah dipastikan tidak dipakai.
2. Perbaiki render path level admin agar sesuai dengan file frontend yang benar.
3. Sembunyikan menu deferred dari sidebar dulu, bukan hapus total fiturnya.
4. Jadikan halaman user utama hanya: Beranda, Kuis, Review Kosakata/Flashcard, Progress, Upgrade.
5. Jadikan menu admin utama hanya: Beranda, Kuis/Soal, Kosakata, Flashcard, Data Murid, Analitik.
6. Jadikan menu superadmin utama hanya: Beranda, Data User, Data Admin, Pemasukan/Payment.
7. Payment perlu dirapikan menuju QRIS/manual proof upload sesuai keputusan client.

## Status

Frontend bisa dibuild, tetapi belum sesuai scope final v2. Kondisinya aman sebagai hasil porting awal, namun perlu pemangkasan menu dan folder agar tidak membingungkan programmer berikutnya.
