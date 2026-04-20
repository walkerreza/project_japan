# File Catatan Tambahan (Backlog Tersaring)

Berdasarkan audit sebelumnya, **sebagian besar poin kritis (Otentikasi, Resolusi Database, Logika Pembelajaran, Form Validasi, Gamifikasi & Paginasi)** telah **DISELESAIKAN** pada rilis tim sebelumnya. 

Berikut adalah saringan murni untuk **sisa poin yang BENAR-BENAR BELUM diimplementasikan** saat ini:

### Yang Masih Kurang: Backend, Data, & Middleware
- [ ] Belum ada `SubscriptionMiddleware` untuk restriksi modul Free vs Premium, beserta _upgrade prompt_-nya.
- [ ] Tabel/payment domain belum dibuat: `payment_plans`, `subscriptions`, `transactions`, `subscription_logs`.
- [ ] Entitas superadmin pengguna raib: `cohort/kloter`, `key access` massal, `activity logs`, import/export user.
- [ ] File _Seeder_ belum representatif, `DatabaseSeeder.php` tidak memanggil seeder utuh.

### Yang Masih Kurang: Fitur Superadmin (Area Paling Kosong)
- [ ] Semua rute superadmin (`/superadmin/users`, `/superadmin/activity`, `/superadmin/content`) sekadar me-render UI statis kosong tanpa _Controller_ data.
- [ ] Tidak ada manajemen untuk memblokir _User_ atau mendaftarkan _Admin_ baru dari Dasbor.

### Yang Masih Kurang: Panel Admin
- [ ] Halaman React untuk **Questions** (`Admin/Questions/Index` dan Edit) belum rapi dirangkai untuk integrasi CRUD soal yang leluasa.
- [ ] Tidak ada fitur Bulk Import (CSV/JSON) soal ujian secara massal.
- [ ] Level Management (N5, N4, dst) belum mempunyai UI jika memang dibutuhkan selain _Seeder_.

### Yang Masih Kurang: Public & Maintenance
- [ ] SEO publik masih lemah (Belum ada _Open Graph_, _JSON-LD_, Canonical, Sitemap dinamis).
- [ ] _Forgot Password_ perlu diberi aturan Limit (throttle) 3 email per menit sesuai keamanan standar.
- [ ] _Test Coverage_ (Pest/PHPUnit) tidak menyentuh flow sistem uang, sertifikat, dan progress siswa sama sekali.