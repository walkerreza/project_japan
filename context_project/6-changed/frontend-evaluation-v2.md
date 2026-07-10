# Evaluasi Frontend V2

Tanggal evaluasi: 2026-06-29

## Ringkasan

Frontend `japanlingov2` saat ini sudah bisa dibuild dan route frontend tidak ditemukan mismatch dengan route Laravel. Namun dari sisi scope produk, frontend belum sepenuhnya sesuai dengan arah terbaru dari client di `context_project/Chat WhatsApp dengan Fuad (Jepang)` dan keputusan v2.

Masalah utamanya bukan error compile, tetapi ketidaksesuaian arah produk. Banyak fitur dari web lawas masih tampil sebagai fitur aktif, padahal untuk v2 beberapa fitur harus dipending, disederhanakan, atau dipindah ke backlog.

## Kondisi Saat Ini

Frontend masih membawa banyak struktur dari web lawas:

- User masih melihat banyak menu belajar sekaligus.
- Admin masih memiliki builder materi, presentasi, kanji, gamifikasi, dan fitur konten luas.
- Superadmin masih membawa menu konten, sistem, aktivitas, dan gamifikasi.
- Payment masih terasa manual/access key, belum QRIS-first.
- Ada duplikasi folder `Pages/User` dan `Pages/Pengguna`.
- Ada satu render path Inertia yang belum cocok dengan file frontend.

Secara teknis frontend belum rusak besar, tetapi secara scope masih terlalu lebar untuk v2.

## Evaluasi Berdasarkan Scope Client

### 1. Flow Belajar User

Target v2:

`Beranda -> Flashcard/Kosakata -> Kuis -> Progress -> Upgrade`

Kondisi saat ini:

- User masih melihat `Pelajaran`.
- User masih melihat `Peringkat`.
- User masih melihat `Sertifikat`.
- User masih bisa diarahkan ke materi panjang.

Evaluasi:

Belum sesuai. Frontend masih lesson/module-centric seperti versi lawas, sementara arah v2 lebih cocok quiz-first dan flashcard/kosakata-first.

Dampak:

- User bisa bingung harus mulai dari materi, flashcard, atau kuis.
- Demo ke client bisa terlihat belum fokus.
- Fitur yang seharusnya pending terlihat seperti janji fitur aktif.

Prioritas:

Tinggi.

Rekomendasi:

Sederhanakan sidebar user menjadi:

- Beranda
- Kuis
- Review Kosakata
- Progress
- Upgrade

`Pelajaran`, `Peringkat`, dan `Sertifikat` sebaiknya disembunyikan dulu dari navigasi utama.

## 2. Materi dan Modul

Target v2:

- Materi/module dipending dulu.
- Materi dari Drive diarahkan untuk digamifikasi, bukan menjadi halaman materi panjang.
- Materi tidak menjadi pusat experience fase beta.

Kondisi saat ini:

- `User/Materi` dan `Pengguna/Materi` masih ada.
- `Admin/ModulMateri` masih aktif.
- Builder materi masih tersedia.

Evaluasi:

Belum sesuai. Fitur materi/modul masih terlalu besar untuk scope terbaru.

Dampak:

- Backend dan frontend harus menjaga fitur yang belum prioritas.
- Risiko maintenance meningkat.
- Fokus pengembangan kuis/flashcard/payment bisa terganggu.

Prioritas:

Tinggi.

Rekomendasi:

Jangan hapus total dulu. Sembunyikan dari menu dan tandai sebagai deferred. Pertahankan file untuk referensi, tetapi jangan jadikan alur utama.

## 3. Kuis

Target v2:

- Kuis adalah fitur inti.
- Kuis harus terasa sebagai aktivitas belajar utama.
- Admin perlu workflow pembuatan soal/kuis yang efisien.

Kondisi saat ini:

- User kuis tersedia.
- Admin kuis dan soal tersedia.
- Builder kuis tersedia.

Evaluasi:

Cukup sesuai. Ini termasuk bagian frontend yang layak dipertahankan dan difokuskan.

Dampak:

- Bisa menjadi pusat beta.
- Perlu diuji lebih detail pada submit attempt, skor, XP, dan hasil.

Prioritas:

Tinggi untuk distabilkan, bukan dipangkas.

Rekomendasi:

Pertahankan halaman kuis. Setelah backend stabil, lanjutkan integrasi data dan polish UX kuis.

## 4. Flashcard dan Kosakata

Target v2:

- Flashcard/kosakata adalah fitur inti.
- Library awal cukup kosakata dulu.
- Flashcard idealnya nyambung ke kuis/game.

Kondisi saat ini:

- User flashcard tersedia.
- Admin flashcard tersedia.
- Admin kosakata tersedia.
- Kanji Bank juga masih tampil.

Evaluasi:

Flashcard dan kosakata sudah sesuai. Kanji Bank penuh belum sesuai prioritas awal.

Dampak:

- Flashcard/kosakata bisa langsung jadi selling point.
- Kanji Bank penuh bisa memperbesar scope terlalu cepat.

Prioritas:

Tinggi untuk flashcard/kosakata. Sedang/rendah untuk Kanji Bank.

Rekomendasi:

Pertahankan `Flashcard` dan `Kosakata`. Sembunyikan `Kanji Bank` dulu atau jadikan submenu/backlog.

## 5. Payment / QRIS

Target v2:

- Payment diarahkan ke dalam negeri dan QRIS.
- Premium/free access tetap ada.
- Manual/access key boleh ada sebagai pendukung, bukan flow utama jangka panjang.

Kondisi saat ini:

- Pricing tersedia.
- Superadmin payment tersedia.
- Manual payment dan access key masih dominan.
- QRIS belum menjadi flow utama yang jelas.

Evaluasi:

Belum sesuai. Payment belum QRIS-first.

Dampak:

- Alur pembayaran belum menjawab request terbaru client.
- User belum mendapat flow upgrade yang jelas.
- Superadmin masih mengelola flow manual yang berat.

Prioritas:

Tinggi.

Rekomendasi:

Rapikan payment menjadi:

- User pilih paket.
- User melihat QRIS/payment instruction.
- User upload bukti bayar jika masih manual-confirmation.
- Superadmin approve/reject transaksi.
- Access key tetap ada untuk demo atau kebutuhan khusus.

## 6. Presentasi dan Board Ajar

Target v2:

- Client pernah meminta presentasi seperti Quizizz/PowerPoint ringan.
- Presentasi diedit admin, user hanya viewer/share target.
- Versi lengkap presentation/board tidak harus masuk v2 awal.

Kondisi saat ini:

- Admin presentasi aktif.
- Admin board ajar aktif.
- Builder presentasi cukup besar.

Evaluasi:

Sebagian sesuai sebagai referensi, tetapi terlalu besar untuk scope awal v2.

Dampak:

- Menambah kompleksitas UI dan backend.
- Bisa mengalihkan fokus dari kuis/flashcard/payment.

Prioritas:

Sedang.

Rekomendasi:

Sembunyikan dari sidebar utama. Simpan sebagai backlog atau fitur setelah core stabil.

## 7. Superadmin

Target v2:

Superadmin fokus pada:

- Data user
- Data admin
- Payment/pemasukan
- Monitoring dasar

Kondisi saat ini:

- Superadmin memiliki `Konten`, `Gamifikasi`, `Aktivitas`, `Sistem`.
- Menu terlalu luas untuk fase awal.

Evaluasi:

Belum sesuai. Superadmin masih terlalu enterprise/full-platform.

Dampak:

- Scope terasa membesar.
- Programmer berikutnya bisa salah fokus.
- UI superadmin bisa terlihat penuh fitur tapi tidak semua siap.

Prioritas:

Sedang.

Rekomendasi:

Menu superadmin v2 awal cukup:

- Beranda
- Data User
- Data Admin
- Pemasukan/Payment

Menu lain disembunyikan sampai ada kebutuhan pasti.

## 8. Struktur Folder Frontend

Masalah:

Ada duplikasi folder:

- `resources/js/Pages/User`
- `resources/js/Pages/Pengguna`

Backend saat ini merender ke:

- `Pages/Pengguna/*`

Evaluasi:

Belum rapi. Duplikasi ini bisa membingungkan saat refactor.

Dampak:

- Programmer bisa mengedit folder yang tidak dipakai.
- Risiko bug karena ada dua versi halaman mirip.
- Build tetap berhasil, tetapi maintenance buruk.

Prioritas:

Tinggi.

Rekomendasi:

Tetapkan `Pages/Pengguna` sebagai folder aktif karena backend sudah memakai path tersebut. Setelah dicek aman, `Pages/User` bisa dihapus atau dipindah ke folder arsip.

## 9. Render Path Level Admin

Masalah:

Backend render:

- `Admin/LevelPembelajaran/ManajemenLevel`

File yang tersedia:

- `Pages/Admin/Level/ManajemenLevel.jsx`
- `Pages/Admin/ManajemenLevel.jsx`

Evaluasi:

Ini potensi error runtime saat halaman level admin dibuka.

Dampak:

- Admin level bisa blank/error.
- Demo bisa terganggu jika route ini dibuka.

Prioritas:

Tinggi.

Rekomendasi:

Samakan render path backend dengan file yang dipakai. Disarankan pakai:

- `Admin/Level/ManajemenLevel`

## Prioritas Tindakan

### Wajib Dikerjakan Dulu

1. Perbaiki render path `Admin/LevelPembelajaran/ManajemenLevel`.
2. Tentukan folder aktif user: `Pages/Pengguna`.
3. Sembunyikan menu deferred dari sidebar.
4. Fokuskan user flow ke Beranda, Kuis, Flashcard/Kosakata, Progress, Upgrade.
5. Rapikan payment agar mengarah ke QRIS/manual proof flow.

### Bisa Setelah Core Stabil

1. Refactor tampilan kuis.
2. Refactor flashcard/kosakata.
3. Rapikan admin builder kuis dan flashcard.
4. Integrasi QRIS lebih otomatis.
5. Evaluasi ulang presentasi, board, sertifikat, leaderboard, dan berita.

### Jangan Jadi Prioritas Awal

1. Full materi/module builder.
2. Kanji Bank penuh.
3. Presentasi/board lengkap.
4. Superadmin sistem/theme global.
5. Gamifikasi campaign penuh.
6. Sertifikat lengkap.
7. Portal berita/konten luas.

## Keputusan Evaluasi

Frontend v2 aman sebagai hasil porting awal, tetapi belum layak dianggap final secara scope. Strategi terbaik bukan rewrite ulang total, melainkan pemangkasan terkontrol:

1. Hide fitur deferred dari navigasi.
2. Pertahankan file lawas sebagai referensi sementara.
3. Stabilkan fitur inti.
4. Baru hapus atau arsipkan file yang benar-benar tidak dipakai.

Dengan pendekatan ini, kualitas kode lama tidak langsung dirusak, tetapi arah v2 tetap kembali sesuai request client.
